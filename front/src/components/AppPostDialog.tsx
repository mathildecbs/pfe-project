import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import styles from "../css/AppPostDialog.module.css";
import { Tag } from '../types/tagType';
import ApiUtils from '../utils/ApiUtils';
import { useAuth } from '../auth/AuthProvider';

interface AppPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppPostDialog({ isOpen, onClose }: AppPostDialogProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [tagsToDisplay, setTagsToDisplay] = useState<Tag[]>([]);
  const [postContent, setPostContent] = useState('');
  const { user } = useAuth();

  async function publishPost(): Promise<void> {
    try {
      await ApiUtils.getApiInstanceJson().post('/post', {
        user: user?.username,
        parent: "",
        tags: [],
        content: postContent
      });
      onClose();
    } catch (error) {
      throw new Error('Erreur lors de la sortie du groupe');
    }
  }

  function handleTagsSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const tagName = event.target.value;
    const selectedTag = tags.find(tag => tag.name === tagName);
    if (selectedTag) {
      setSelectedTag(selectedTag);
    }
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
        <TextField
          className={styles.TagsSelect}
          id="select-tags"
          select
          label="Tags"
          value={selectedTag ? selectedTag.name : ''}
          onChange={handleTagsSelect}
        >
          {tagsToDisplay.map(tag => (
            <MenuItem key={tag.id} value={tag.name}>
              {tag.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button color='error' onClick={onClose}>Close</Button>
        <Button variant='contained' onClick={publishPost}>Post</Button>
      </DialogActions>
    </Dialog>
  );
}
