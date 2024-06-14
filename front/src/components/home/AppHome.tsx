import { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ToastUtils from "../../utils/ToastUtils";
import styles from "../../css/AppHome.module.css";
import { usePosts } from "../../contexts/PostsProvider";
import albumService from "../../services/AlbumService";
import AppPost from "../community/AppPost";
import { Album } from "../../types/AlbumType";
import postService from "../../services/PostService";

export default function AppHome() {
  const { posts, setPosts } = usePosts();
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
    fetchPosts();
  }, []);

  async function fetchAlbums() {
    try {
      const response = await albumService.getAlbums();
      setAlbums(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  async function fetchPosts() {
    try {
      const response = await postService.getPosts();
      setPosts(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des posts");
    }
  }

  function renderPosts() {
    return (
      <div className={styles.ContainerPosts}>
        <div className={styles.Posts}>
          {posts.slice(0, 4).map((post) => (
            <AppPost key={post.id} post={post} repost={false} />
          ))}
        </div>
        <Button
          className={styles.MoreButton}
          onClick={() => navigate("/collectionInclusions")}
        >
          Plus...
        </Button>
      </div>
    );
  }

  function renderAlbums() {
    return (
      <div className={styles.Container}>
        {albums.slice(0, 4).map((album) => (
          <div
            key={album.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneAlbum/${album.id}`)}
          >
            <Typography variant="h6" className={styles.ItemText}>
              {album.name}
            </Typography>
          </div>
        ))}
        <Button
          className={styles.MoreButton}
          onClick={() => navigate("/collectionAlbums")}
        >
          Plus...
        </Button>
      </div>
    );
  }

  return (
    <>
      <Paper className={styles.Section}>
        <Typography variant="h4">Albums récemment ajoutés</Typography>
        {renderAlbums()}
      </Paper>
      <Paper className={styles.Section}>
        <Typography variant="h4">Posts récents</Typography>
        {renderPosts()}
      </Paper>
    </>
  );
}
