import { useEffect, useState } from "react";
import AppPost from "./AppPost";
import { usePosts } from "../../contexts/PostsProvider";
import postService from "../../services/PostService";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import { Paper, Tabs, Tab, Typography } from "@mui/material";
import { Post } from "../../types/PostType";
import styles from "../../css/AppCommunity.module.css";
import { useNavigate } from "react-router-dom";

export default function AppCommunity() {
  const {
    posts,
    setPosts,
    trendingPosts,
    setTrendingPosts,
    followingPosts,
    setFollowingPosts,
    trendingTags,
    setTrendingTags,
  } = usePosts();
  const { user, authToken } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [selectedTab]);

  async function fetchPosts() {
    try {
      if (authToken) {
        if (selectedTab === 0) {
          const response = await postService.getPosts(authToken);
          setPosts(response);
        } else if (selectedTab === 1 && user) {
          const response = await postService.getFollowingPosts(user.username, authToken);
          setFollowingPosts(response);
        } else if (selectedTab === 2 && user) {
          const posts = await postService.getTrendingPosts(authToken);
          setTrendingPosts(posts);
          const tags = await postService.getTrendingTags(authToken);
          setTrendingTags(tags);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  function navigateTo(artistId: string) {
    navigate(`/tagPage/${artistId}`);
  }

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
          <Tab label="Trendings" />
        </Tabs>
      </Paper>
      <div className={styles.PostsContainer}>
        <div className={styles.Posts}>
          {displayedPosts.map((postReceived) => (
            <AppPost key={postReceived.id} post={postReceived} repost={false} />
          ))}
        </div>
        {selectedTab === 2 && (
          <div className={styles.TrendingTags}>
            <Paper className={styles.TagsContainer}>
              <Typography variant="h6" className={styles.TagsTitle}>
                Trending Tags
              </Typography>
              <ul className={styles.TagsList}>
                {trendingTags.map((tag) => (
                  <li
                    key={tag.id}
                    className={styles.TagItem}
                    onClick={() => navigateTo(tag.name)}
                  >
                    #{tag.name}
                  </li>
                ))}
              </ul>
            </Paper>
          </div>
        )}
      </div>
    </>
  );
}
