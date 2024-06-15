import { useEffect, useState } from "react";
import { Post } from "../../types/PostType";
import { useAuth } from "../../contexts/AuthProvider";
import AppPost from "./AppPost";
import ToastUtils from "../../utils/ToastUtils";
import { Typography } from "@mui/material";
import styles from "../../css/AppTagPage.module.css";
import { useParams } from "react-router-dom";
import postService from "../../services/PostService";
import { usePosts } from "../../contexts/PostsProvider";

export default function AppTagPage() {
  const { user, authToken } = useAuth();
  const { tagName } = useParams();
  const { tagPosts, setTagPosts } = usePosts();

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
    const repostStatus = new Map<string, boolean>();

    posts.forEach((post) => {
      const isUserInPostReposts = post.reposts
        ? post.reposts.some((repost) => repost.username === user?.username)
        : false;
      repostStatus.set(post.id, isUserInPostReposts);
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
              repost={false}
              tag={tagName}
            />
          ))}
        </div>
      ) : (
        <Typography variant="h6">Pas de post avec ce tag.</Typography>
      )}
    </>
  );
}
