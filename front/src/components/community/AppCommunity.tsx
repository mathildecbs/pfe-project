import { useEffect, useState } from "react";
import AppPost from "./AppPost";
import { usePosts } from "../../contexts/PostsProvider";
import postService from "../../services/PostService";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import { Paper, Tabs, Tab } from "@mui/material";
import { Post } from "../../types/PostType";
import styles from "../../css/AppCommunity.module.css";

export default function AppCommunity() {
  const {
    posts,
    setPosts,
    trendingPosts,
    setTrendingPosts,
    followingPosts,
    setFollowingPosts,
  } = usePosts();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [selectedTab]);

  async function fetchPosts() {
    try {
      if (selectedTab === 0) {
        const response = await postService.getPosts();
        setPosts(response);
      } else if (selectedTab === 1 && user) {
        const response = await postService.getFollowingPosts(user.username);
        setFollowingPosts(response);
      } else if (selectedTab === 2 && user) {
        const response = await postService.getTrendingPosts();
        setTrendingPosts(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  let displayedPosts: Post[] = [];
  if (selectedTab === 0) {
    displayedPosts = posts;
  } else if (selectedTab === 1) {
    displayedPosts = followingPosts;
  } else if (selectedTab === 2) {
    displayedPosts = trendingPosts;
  }

  return (
    <>
      <Paper className={styles.Tabs}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Posts" />
          <Tab label="Abonnements" />
          <Tab label="Trending" />
        </Tabs>
      </Paper>
      <div className={styles.Posts}>
        {displayedPosts.map((postReceived) => (
          <AppPost key={postReceived.id} post={postReceived} repost={false} />
        ))}
      </div>
    </>
  );
}
