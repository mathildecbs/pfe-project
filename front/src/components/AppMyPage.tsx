import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import { Post } from "../types/PostType";
import { useAuth } from "../auth/AuthProvider";
import AppPost from "./AppPost";
import userService from "../services/UserService";
import { User } from "../types/UserType";

export default function AppMyPage() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const [currentUser, setCurrentUSer] = useState<User>();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      if (user) {
        const response = await userService.getOneUser(user.id);
        setCurrentUSer(response);
      }
    } catch (error) {
      console.log("Erreur lors de la récupération des posts");
    }
  }

  return (
    <>
      {currentUser?.feed.map((myPost) => (
        <AppPost key={myPost.id} post={myPost} />
      ))}
    </>
  );
}
