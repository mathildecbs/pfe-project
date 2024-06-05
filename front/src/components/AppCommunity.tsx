import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import AppPost from "./AppPost";
import { Post } from "../types/PostType";
import postService from "../services/PostService";

export default function AppCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await postService.getPosts();
      setPosts(response);
    } catch (error) {
      console.log('Erreur lors de la récupération des posts');
    }
  }

  return (
    <>
    {posts.map((postReceived) => (
      <AppPost key={postReceived.id} post={postReceived}/>
    ))}
    </>
  );
}
