import { useEffect, useState } from "react";
import { Post } from "../../types/PostType";
import { useAuth } from "../../contexts/AuthProvider";
import AppPost from "./AppPost";
import ToastUtils from "../../utils/ToastUtils";
import { Typography } from "@mui/material";
import styles from "../../css/AppTagPage.module.css";
import { useParams } from "react-router-dom";
import postService from "../../services/PostService";

export default function AppMyPage() {
  const [tagPosts, setTagPosts] = useState<Post[]>([]);
  const { user, authToken } = useAuth();
  const { tagName } = useParams();

  useEffect(() => {
    fetchTagPosts();
  }, [tagName]);

  async function fetchTagPosts() {
    try {
      if (tagName && authToken) {
        const response = await postService.getOneTagPosts(tagName, authToken);
        setTagPosts(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  function getPostRepostStatus(posts: Post[]) {
    const occurrences = new Map<number, number>();
    const repostStatus = new Map<number, boolean>();

    posts.forEach((post) => {
      const count = (occurrences.get(post.id) || 0) + 1;
      occurrences.set(post.id, count);
      repostStatus.set(
        post.id,
        count > 1 || post.user.username !== user?.username
      );
    });

    return repostStatus;
  }

  const repostStatus = getPostRepostStatus(tagPosts);

  return (
    <>
      {tagPosts.length ? (
        <div className={styles.ContainerPosts}>
          {tagPosts.map((tagPost, index) => (
            <AppPost
              key={`${tagPost.id}${
                !!repostStatus.get(tagPost.id) &&
                index === tagPosts.findIndex((post) => post.id === tagPost.id)
              }}`}
              post={tagPost}
              repost={
                !!repostStatus.get(tagPost.id) &&
                index === tagPosts.findIndex((post) => post.id === tagPost.id)
              }
            />
          ))}
        </div>
      ) : (
        <Typography variant="h6">Pas de post avec ce tag.</Typography>
      )}
    </>
  );
}
