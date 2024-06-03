import { Paper, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../css/AppPost.module.css";

export default function AppPost() {
  // Exemples
  const likes = 127;
  const comments = 127;
  const reposts = 127;

  return (
    <Paper className={styles.PostContainer}>
      <div className={styles.Header}>
        <Typography variant="h6" className={styles.Name}>
          Name
        </Typography>
        <Typography variant="body2" className={styles.Username}>
          @name
        </Typography>
        <Typography variant="body2" className={styles.Time}>
          4h
        </Typography>
      </div>
      <Typography variant="body1" className={styles.Message}>
        post message
      </Typography>
      <Typography variant="body2" className={styles.Tags}>
        #tags
      </Typography>
      <div className={styles.Actions}>
        <IconButton className={styles.ActionButton}>
          <CommentIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {comments}
          </Typography>
        </IconButton>
        <IconButton className={styles.ActionButton}>
          <RepeatIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {reposts}
          </Typography>
        </IconButton>
        <IconButton className={styles.ActionButton}>
          <FavoriteBorderIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {likes}
          </Typography>
        </IconButton>
      </div>
    </Paper>
  );
}
