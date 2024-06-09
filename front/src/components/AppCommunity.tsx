import { useEffect, useState } from "react";
import AppPost from "./AppPost";
import { usePosts } from "../contexts/PostsProvider";
import postService from "../services/PostService";
import ToastUtils from "../utils/ToastUtils";

export default function AppCommunity() {
  const { posts, setPosts } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await postService.getPosts();
      setPosts(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  return (
    <>
      {posts.map((postReceived) => (
        <AppPost key={postReceived.id} post={postReceived} repost={false} />
      ))}
    </>
  );
}
