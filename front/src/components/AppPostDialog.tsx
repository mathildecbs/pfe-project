import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import styles from "../css/AppPostDialog.module.css";
import { Tag } from "../types/TagType";
import ApiUtils from "../utils/ApiUtils";
import { useAuth } from "../contexts/AuthProvider";
import { usePosts } from "../contexts/PostsProvider";

interface AppPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppPostDialog({ isOpen, onClose }: AppPostDialogProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [tagsToDisplay, setTagsToDisplay] = useState<Tag[]>([]);
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);
  const [postContent, setPostContent] = useState("");
  const { user } = useAuth();
  const { addPost } = usePosts();

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/tag");
      setTags(response.data);
      setTagsToDisplay(response.data);
    } catch (error) {
      console.log("Erreur lors de la récupération des tags");
    }
  }

  async function publishPost(): Promise<void> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/post", {
        user: user?.username,
        parent: "",
        tags: selectedTag ? [selectedTag] : [],
        content: postContent,
      });
      addPost(response.data);
      onClose();
    } catch (error) {
      console.error("Erreur lors du post", error);
    }
  }

  function handleTagsSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const tagName = event.target.value;
    const selectedTag = tags.find((tag) => tag.name === tagName);
    if (selectedTag) {
      setSelectedTag(selectedTag);
    }
  }

  function handleAddTag() {

  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Ecrire une nouvelle publication</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="post-content"
          label="Ecrire ici..."
          type="text"
          fullWidth
          multiline
          rows={7}
          variant="outlined"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <Box display="flex" alignItems="center" gap="0.5em">
          <TextField
            className={styles.TagsSelect}
            id="select-tags"
            select
            label="Tags"
            value={selectedTag ? selectedTag.name : ""}
            onChange={handleTagsSelect}
          >
            {tagsToDisplay.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={handleAddTag}>Ajouter</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Fermer
        </Button>
        <Button variant="contained" onClick={publishPost}>
          Poster
        </Button>
      </DialogActions>
    </Dialog>
  );
}
