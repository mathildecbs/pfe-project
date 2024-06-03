import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import { Post } from "../types/postType";
import { useAuth } from "../auth/AuthProvider";
import AppPost from "./AppPost";

export default function AppMyPage() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(){
    try {
      // FIND THE RIGHT ROUTE
      const response = await ApiUtils.getApiInstanceJson().get(`/post/${user?.id}`);
      const postsList = response.data;
      setMyPosts(postsList);
    } catch (error) {
      console.log('Erreur lors de la récupération des posts');
    }
  } 
  return (
    <>
    {myPosts.map((myPost) => (
      <AppPost key={myPost.id} post={myPost}/>
    ))}
    </>
  )
}
