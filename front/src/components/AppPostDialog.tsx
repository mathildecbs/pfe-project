import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "../css/AppPostDialog.module.css";
import { Tag } from "../types/TagType";
import ApiUtils from "../utils/ApiUtils";
import { useAuth } from "../contexts/AuthProvider";
import { usePosts } from "../contexts/PostsProvider";
import ToastUtils from "../utils/ToastUtils";

interface AppPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppPostDialog({ isOpen, onClose }: AppPostDialogProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
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
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des tags");
    }
  }

  async function publishTag(tagName: string) {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/tag", {
        name: tagName,
      });
      return response.data;
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la création du tag");
    }
  }

  async function publishPost(): Promise<void> {
    try {
      if (!user) return;

      const newTags = await Promise.all(
        selectedTags.map(async (tag) => {
          if (!tag.id) {
            const newTag = await publishTag(tag.name);
            return newTag;
          }
          return tag;
        })
      );

      const tagsToSend = newTags.map((tag) => tag.name);
      const response = await ApiUtils.getApiInstanceJson().post("/post", {
        user: user.username,
        parent: "",
        tags: tagsToSend,
        content: postContent,
      });

      addPost(response.data);
      ToastUtils.success("Publication créée avec succès !");
      onClose();
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la publication du post");
    }
  }

  function handleAddTag() {
    const existingTag = tags.find((tag) => tag.name === inputValue);
    if (existingTag) {
      setSelectedTags([...selectedTags, existingTag]);
    } else {
      setSelectedTags([...selectedTags, { name: inputValue } as Tag]);
    }
    setInputValue("");
  }

  const availableTags = tags.filter(
    (tag) => !selectedTags.some((selectedTag) => selectedTag.name === tag.name)
  );

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
        <Box display="flex" alignItems="center" gap="0.5em" mt={2}>
          <Autocomplete
            className={styles.TagsInput}
            freeSolo
            options={availableTags.map((tag) => tag.name)}
            value={inputValue}
            onChange={(event, newValue) => {
              setInputValue(newValue || "");
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Tags" variant="outlined" />
            )}
          />
          <Button onClick={handleAddTag}>Ajouter</Button>
        </Box>
        <Box mt={1}>
          {selectedTags.map((tag) => (
            <Chip
              key={tag.name}
              label={tag.name}
              onDelete={() => {
                setSelectedTags(
                  selectedTags.filter((t) => t.name !== tag.name)
                );
              }}
              className={styles.TagChip}
            />
          ))}
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
