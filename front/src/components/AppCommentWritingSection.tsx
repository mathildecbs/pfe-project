import {
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import styles from "../css/AppPost.module.css";
import postService from "../services/PostService";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Post } from "../types/PostType";

interface AppCommentWritingSectionProps {
  post: Post;
  addNewComment: (comment: Post) => void;
}

export default function AppCommentWritingSection({
  post,
  addNewComment,
}: AppCommentWritingSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const { user } = useAuth();

  async function submitComment() {
    try {
      if (user) {
        const newComment = await postService.publishPost(user, commentContent, post.id);
        addNewComment(newComment);
        setCommentContent("");
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout du commentaire");
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
      <Button disabled={commentContent === ""} onClick={submitComment}>Commenter</Button>
    </Paper>
  );
}
