import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../types/PostType";
import { useAuth } from "../../contexts/AuthProvider";
import AppPost from "./AppPost";
import postService from "../../services/PostService";
import ToastUtils from "../../utils/ToastUtils";
import { Typography } from "@mui/material";
import AppHeaderProfile from "./AppHeaderProfile";
import userService from "../../services/UserService";
import { User } from "../../types/UserType";

export default function AppUserPage() {
  const [userProfile, setUserProfile] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [repostStatus, setRepostStatus] = useState<Map<string, boolean>>(new Map());
  const { user, authToken } = useAuth();
  const { username } = useParams();

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [username]);

  useEffect(() => {
    setRepostStatus(getPostRepostStatus(userPosts));
  }, [userPosts]);

  async function fetchUserProfile() {
    try {
      if (username) {
        const response = await userService.getOneUser(username);
        setUserProfile(response);
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la récupération du profil utilisateur"
      );
    }
  }

  async function fetchUserPosts() {
    try {
      if (username && authToken) {
        const response = await postService.getFeed(username, authToken);
        setUserPosts(response);
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la récupération des posts de l'utilisateur"
      );
    }
  }

  function getPostRepostStatus(posts: Post[]) {
    const repostStatus = new Map<string, boolean>();

    posts.forEach((post) => {
      const isRepost = userProfile?.reposts.some((repost) => repost.id === post.id);
      repostStatus.set(post.id, isRepost || false);
    });

    return repostStatus;
  }

  return (
    <>
      {userProfile ? (
        <>
          {user && (
            <AppHeaderProfile userProfile={userProfile} currentUser={user} />
          )}
          {userPosts.length ? (
            userPosts.map((userPost, index) => (
              <AppPost
                key={`${userPost.id}${
                  !!repostStatus.get(userPost.id) &&
                  index ===
                    userPosts.findIndex((post) => post.id === userPost.id)
                }}`}
                post={userPost}
                repost={!!repostStatus.get(userPost.id)}
              />
            ))
          ) : (
            <Typography variant="h6">
              Cet utilisateur n'a pas encore publié de post.
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="h6">Chargement du profil...</Typography>
      )}
    </>
  );
}
