import { Paper, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../css/AppPost.module.css";
import { Post } from "../types/PostType";
import { DateUtils } from "../utils/DateUtils";
import postService from "../services/PostService";
import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AppPostProps {
  post: Post;
}

export default function AppPost({ post }: AppPostProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes.length);
  const [reposts, setReposts] = useState(post.reposts.length);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.username === user?.username)
  );
  const [hasReposted, setHasReposted] = useState(
    post.reposts.some((repost) => repost.username === user?.username)
  );
  const linkToPost = `/post/${post.id}`

  async function actionPost(actionType: string) {
    try {
      const response = await postService.actionPost(
        post.id,
        user?.username,
        actionType
      );

      if (response) {
        if (actionType === "like" && !hasLiked) {
          setLikes(likes + 1);
          setHasLiked(true);
        }
        if (actionType === "repost" && !hasReposted) {
          setReposts(reposts + 1);
          setHasReposted(true);
        }
      }
    } catch (error) {
      console.log("Erreur lors de l'action sur le post", error);
    }
  }

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
        <IconButton
          className={styles.ActionButton}
          component={Link}
          to={linkToPost}
        >
          <CommentIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {post.nb_comment ? post.nb_comment : "0"}
          </Typography>
        </IconButton>
        <IconButton
          className={styles.ActionButton}
          onClick={() => actionPost("repost")}
        >
          <RepeatIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {reposts}
          </Typography>
        </IconButton>
        <IconButton
          className={styles.ActionButton}
          onClick={() => actionPost("like")}
        >
          <FavoriteBorderIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {likes}
          </Typography>
        </IconButton>
      </div>
    </Paper>
  );
}
