import { Paper, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../css/AppPost.module.css";
import { Post } from "../types/postType";
import { DateUtils } from "../utils/DateUtils";

interface AppPostProps {
  post: Post;
}

export default function AppPost({ post }: AppPostProps) {
  return (
    <Paper className={styles.PostContainer}>
      <div className={styles.Header}>
        <Typography variant="h6" className={styles.Name}>
          {post.user.name}
        </Typography>
        <Typography variant="body2" className={styles.Username}>
          @{post.user.username}
        </Typography>
        <Typography variant="body2" className={styles.Time}>
          {DateUtils.formatReadableDate(post.create_date)}
        </Typography>
      </div>
      <Typography variant="body1" className={styles.Message}>
        {post.content}
      </Typography>
      <div className={styles.Tags}>
        {post.tags.map((tag, index) => (
          <Typography
            key={index}
            variant="body2"
            component="span"
            className={styles.Tag}
          >
            #{tag.name}{" "}
          </Typography>
        ))}
      </div>
      <div className={styles.Actions}>
        <IconButton className={styles.ActionButton}>
          <CommentIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {post.nb_comment ? post.nb_comment : "0"}
          </Typography>
        </IconButton>
        <IconButton className={styles.ActionButton}>
          <RepeatIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {/* {post.repost.length} */}
          </Typography>
        </IconButton>
        <IconButton className={styles.ActionButton}>
          <FavoriteBorderIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {post.likes.length}
          </Typography>
        </IconButton>
      </div>
    </Paper>
  );
}
