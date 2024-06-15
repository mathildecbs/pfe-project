import React, { useState } from "react";
import { Button, Typography, Avatar } from "@mui/material";
import { User } from "../../types/UserType";
import userService from "../../services/UserService";
import ToastUtils from "../../utils/ToastUtils";
import styles from "../../css/AppHeaderProfile.module.css";
import { useAuth } from "../../contexts/AuthProvider";

interface AppHeaderProfileProps {
  userProfile: User;
  currentUser: User;
}

export default function AppHeaderProfile({
  userProfile,
  currentUser,
}: AppHeaderProfileProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(
    currentUser?.following.some((user) => user.id === userProfile.id) ?? false
  );
  const { authToken } = useAuth();

  async function handleFollow() {
    try {
      if (currentUser && authToken) {
        await userService.followUser(
          currentUser.username,
          userProfile.username,
          authToken
        );
        setIsFollowing(true);
        ToastUtils.success(`Vous suivez maintenant ${userProfile.username}`);
      }
    } catch (error) {
      ToastUtils.error("Erreur lors du suivi");
    }
  }

  async function handleUnfollow() {
    try {
      if (currentUser && authToken) {
        await userService.unfollowUser(
          currentUser.username,
          userProfile.username,
          authToken
        );
        setIsFollowing(false);
        ToastUtils.success(`Vous ne suivez plus ${userProfile.username}`);
      }
    } catch (error) {
      ToastUtils.error("Erreur lors du désabonnement");
    }
  }

  function renderFollowButton() {
    if (currentUser && userProfile.id !== currentUser.id) {
      return (
        <Button
          variant="outlined"
          color={isFollowing ? "inherit" : "primary"}
          onClick={isFollowing ? handleUnfollow : handleFollow}
          className={styles.FollowButton}
        >
          {isFollowing ? "Suivi" : "Suivre"}
        </Button>
      );
    }
    return null;
  }

  const renderProfileInfo = () => (
    <div className={styles.ProfileInfo}>
      <Typography variant="body1" className={styles.Username}>@{userProfile.username}</Typography>
      <Typography variant="body2" className={styles.Description}>{userProfile.description}</Typography>
      {renderFollowButton()}
    </div>
  );

  return (
    <div className={styles.Header}>
      {userProfile.image ? (
        <div className={styles.UserPhoto}>
          <img
            src={userProfile.image}
            alt={userProfile.username}
            className={styles.ProfilePhoto}
          />
        </div>
      ) : (
        <Avatar className={`${styles.DefaultAvatar} ${styles.UserDefault}`}>
          {userProfile.username.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <div className={styles.UserInfo}>
        <Typography variant="h5">{userProfile.name}</Typography>
        {renderProfileInfo()}
      </div>
    </div>
  );
}
