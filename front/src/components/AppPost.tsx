import React from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import RepeatIcon from '@mui/icons-material/Repeat';
import styles from '../css/AppPost.module.css';

export default function AppPost() {
  return (
    <Paper className={styles.PostContainer}>
      <Typography variant='h5'>
        Name
      </Typography>
      <Typography variant='h5'>
        @name
      </Typography>
      <Typography variant='h5'>
        4h
      </Typography>
      <Typography variant='h5'>
        post message
      </Typography>
      <div className={styles.Actions}>
        <IconButton>
          <CommentIcon />
        </IconButton>
        <IconButton>
          <RepeatIcon />
        </IconButton>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
      </div>
    </Paper>
  );
}
