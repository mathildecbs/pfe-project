import { useState } from "react";
import { Paper, Typography, IconButton, Avatar, Box } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import RepeatIcon from "@mui/icons-material/Repeat";
import styles from "../../css/AppPost.module.css";
import { Post } from "../../types/PostType";
import { DateUtils } from "../../utils/DateUtils";
import postService from "../../services/PostService";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import ToastUtils from "../../utils/ToastUtils";
import { usePosts } from "../../contexts/PostsProvider";

interface AppPostProps {
  post: Post;
  repost: boolean;
}

export default function AppPost({ post, repost }: AppPostProps) {
  const { user } = useAuth();
  const { setPosts } = usePosts();
  const [likes, setLikes] = useState(post.nb_likes ? post.nb_likes : 0);
  const [reposts, setReposts] = useState(post.nb_reposts ? post.nb_reposts : 0);
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
  const navigate = useNavigate();
  const { authToken } = useAuth();

  async function actionPost(actionType: string) {
    try {
      if (authToken) {
        const response = await postService.actionPost(
          post.id,
          user?.username,
          actionType,
          authToken
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
        fetchPosts();
      }
    } catch (error) {
      ToastUtils.error(error, `Erreur lors du ${actionType} du post`);
    }
  }

  async function fetchPosts() {
    try {
      if (authToken) {
        const response = await postService.getPosts(authToken);
        setPosts(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  function navigateTo(root: string, specification: string) {
    navigate(`/${root}/${specification}`);
  }

  return (
    <Paper className={styles.PostContainer}>
      {repost && (
        <Typography variant="body2" className={styles.Repost}>
          <RepeatIcon />
          Reposté
        </Typography>
      )}

      <div className={styles.Header}>
        <div
          className={styles.UserInfo}
          onClick={() => navigateTo("user", post.user.username)}
        >
          {post.user.image ? (
            <Avatar
              src={post.user.image}
              alt={post.user.name}
              className={styles.UserImage}
            />
          ) : (
            <Avatar className={`${styles.DefaultAvatar} ${styles.UserImage}`}>
              {post.user.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
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
      {post.image && (
        <Box display="flex" justifyContent="center" mt={2}>
          <img src={post.image} alt="Post image" className={styles.PostImage} />
        </Box>
      )}
      <div className={styles.Tags}>
        {post.tags.map((tag, index) => (
          <Typography
            key={index}
            variant="body2"
            component="span"
            onClick={() => navigateTo("tagPage", tag.name)}
            className={styles.Tag}
          >
            #{tag.name}{" "}
          </Typography>
        ))}
      </div>
      <div className={styles.Actions}>
        <IconButton
          className={styles.ActionButton}
          onClick={() => navigateTo("post", post.id.toString())}
        >
          <CommentIcon />
          <Typography variant="body2" className={styles.ActionCount}>
            {post.nb_comments ? post.nb_comments : "0"}
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
          {hasLiked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
          <Typography variant="body2" className={styles.ActionCount}>
            {likes}
          </Typography>
        </IconButton>
      </div>
    </Paper>
  );
}
