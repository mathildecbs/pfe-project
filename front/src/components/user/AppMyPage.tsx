import { useEffect } from "react";
import { Post } from "../../types/PostType";
import { useAuth } from "../../contexts/AuthProvider";
import AppPost from "../community/AppPost";
import postService from "../../services/PostService";
import ToastUtils from "../../utils/ToastUtils";
import { Typography } from "@mui/material";
import AppHeaderProfile from "./AppHeaderProfile";
import styles from "../../css/AppMyPage.module.css";
import { usePosts } from "../../contexts/PostsProvider";
import userService from "../../services/UserService";

export default function AppMyPage() {
  const { myFeed, setMyFeed } = usePosts();
  const { user, authToken, updateUser } = useAuth();

  useEffect(() => {
    fetchFeed();
    fetchUserProfile();
  }, []);

  async function fetchFeed() {
    try {
      if (user && authToken) {
        const response = await postService.getFeed(user.username, authToken);
        setMyFeed(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  async function fetchUserProfile() {
    try {
      if (user?.username) {
        const response = await userService.getOneUser(user?.username);
        updateUser(response);
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la récupération du profil utilisateur"
      );
    }
  }

  function getPostRepostStatus(posts: Post[]) {
    const occurrences = new Map<string, number>();
    const repostStatus = new Map<string, boolean>();

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

  const repostStatus = getPostRepostStatus(myFeed);

  return (
    <div className={styles.Container}>
      {user ? (
        <>
          <AppHeaderProfile userProfile={user} currentUser={user} />

          <div className={styles.ContainerPosts}>
            {myFeed.length ? (
              myFeed.map((myPost, index) => (
                <AppPost
                  key={`${myPost.id}${
                    !!repostStatus.get(myPost.id) &&
                    index === myFeed.findIndex((post) => post.id === myPost.id)
                  }}`}
                  post={myPost}
                  repost={
                    !!repostStatus.get(myPost.id) &&
                    index === myFeed.findIndex((post) => post.id === myPost.id)
                  }
                />
              ))
            ) : (
              <Typography variant="h6">
                Commencez à reposter et écrire des posts !
              </Typography>
            )}
          </div>
        </>
      ) : (
        <Typography variant="h6">Chargement du profil...</Typography>
      )}
    </div>
  );
}
