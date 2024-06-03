import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import AppPost from "./AppPost";
import { Post } from "../types/postType";

export default function AppCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(){
    try {
      const response = await ApiUtils.getApiInstanceJson().get('/post');
      const postsList = response.data;
      console.log(postsList);
      setPosts(postsList);
    } catch (error) {
      console.log('Erreur lors de la récupération des posts');
    }
  }  

  return (
    <>
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
      <AppPost />
    </>
  );
}
