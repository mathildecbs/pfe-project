import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import { Post } from "../types/PostType";
import { useAuth } from "../auth/AuthProvider";
import AppPost from "./AppPost";
import userService from "../services/UserService";
import { User } from "../types/UserType";
import postService from "../services/PostService";

export default function AppMyPage() {
  const [myFeed, setMyFeed] = useState<Post[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    try {
      if (user) {
        const response = await postService.getFeed(user.username);
        setMyFeed(response);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des posts");
    }
  }

  return (
    <>
      {myFeed &&
        myFeed.map((myPost) => <AppPost key={myPost.id} post={myPost} />)}
    </>
  );
}
