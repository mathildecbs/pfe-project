import { Paper, Typography, TextField, Button, IconButton, Box, Chip } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styles from "../../css/AppPost.module.css";
import postService from "../../services/PostService";
import { useAuth } from "../../contexts/AuthProvider";
import { useState } from "react";
import { Post } from "../../types/PostType";
import ToastUtils from "../../utils/ToastUtils";

interface AppCommentWritingSectionProps {
  post: Post;
  addNewComment: (comment: Post) => void;
}

export default function AppCommentWritingSection({
  post,
  addNewComment,
}: AppCommentWritingSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { user, authToken } = useAuth();

  async function submitComment() {
    try {
      if (user && authToken) {
        const newComment = await postService.publishPost(
          user.username,
          commentContent,
          [],
          selectedImage,
          authToken,
          post.id
        );
        addNewComment(newComment);
        setCommentContent("");
        setSelectedImage(null);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de l'ajout du commentaire");
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
    }
  }

  return (
    <Paper className={styles.PostContainer}>
      <div className={styles.Header}>
        <Typography variant="h6" className={styles.Name}>
          Répondre à la publication
        </Typography>
      </div>
      <TextField
        autoFocus
        margin="dense"
        id="post-content"
        label="Répondre"
        type="text"
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      />
      <Box mt={2} display="flex" alignItems="center">
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file-comment"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="icon-button-file-comment">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <AddPhotoAlternateIcon />
          </IconButton>
        </label>
        {selectedImage && (
          <Chip
            label={selectedImage.name}
            onDelete={() => setSelectedImage(null)}
            className={styles.TagChip}
          />
        )}
      </Box>
      <Button disabled={commentContent === ""} onClick={submitComment}>
        Commenter
      </Button>
    </Paper>
  );
}
