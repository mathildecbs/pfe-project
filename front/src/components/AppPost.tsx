import { Paper, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../css/AppPost.module.css";
import { Post } from "../types/PostType";
import { DateUtils } from "../utils/DateUtils";
import postService from "../services/PostService";
import { useAuth } from "../contexts/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";

interface AppPostProps {
  post: Post;
}

export default function AppPost({ post }: AppPostProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes ? post.nb_likes : 0);
  const [reposts, setReposts] = useState(
    post.reposts ? post.nb_reposts : 0
  );
  const [hasLiked, setHasLiked] = useState(
    post.likes
      ? post.likes.some((like) => like.username === user?.username)
      : false
  );
  const [hasReposted, setHasReposted] = useState(
    post.reposts
      ? post.reposts.some((repost) => repost.username === user?.username)
      : false
  );
  const linkToPost = `/post/${post.id}`;

  async function actionPost(actionType: string) {
    try {
      const response = await postService.actionPost(
        post.id,
        user?.username,
        actionType
      );
  
      if (response) {
        if (actionType === "like") {
          if (hasLiked) {
            setLikes(likes - 1);
          } else {
            setLikes(likes + 1);
          }
          setHasLiked(!hasLiked);
        }
  
        if (actionType === "unlike") {
          setLikes(likes - 1);
          setHasLiked(false);
        }
  
        if (actionType === "repost") {
          if (hasReposted) {
            setReposts(reposts - 1);
          } else {
            setReposts(reposts + 1);
          }
          setHasReposted(!hasReposted);
        }
  
        if (actionType === "unrepost") {
          setReposts(reposts - 1);
          setHasReposted(false);
        }
      }
    } catch (error) {
      console.log("Erreur lors de l'action sur le post", error);
    }
  }  

  return (
    <Paper className={styles.PostContainer}>
      <div className={styles.Header}>
        <div className={styles.UserInfo}>
          <Typography variant="h6" className={styles.Name}>
            {post.user.name}
          </Typography>
          <Typography variant="body2" className={styles.Username}>
            @{post.user.username}
          </Typography>
        </div>
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
          onClick={() => actionPost(hasReposted ? "unrepost" : "repost")}
        >
          {hasReposted ? <RepeatIcon color="primary" /> : <RepeatIcon />}
          <Typography variant="body2" className={styles.ActionCount}>
            {reposts}
          </Typography>
        </IconButton>
        <IconButton
          className={styles.ActionButton}
          onClick={() => actionPost(hasLiked ? "unlike" : "like")}
        >
          {hasLiked ? (
            <FavoriteIcon color="primary" />
          ) : (
            <FavoriteBorderIcon />
          )}
          <Typography variant="body2" className={styles.ActionCount}>
            {likes}
          </Typography>
        </IconButton>
      </div>
    </Paper>
  );
}
