import { useEffect, useState } from "react";
import albumService from "../../services/AlbumService";
import ToastUtils from "../../utils/ToastUtils";
import { Paper, Typography } from "@mui/material";
import { Album } from "../../types/AlbumType";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppExploAlbums.module.css";

export default function AppExploAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const response = await albumService.getAlbums();
      setAlbums(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  function renderAlbums() {
    return (
      <div className={styles.Container}>
        {albums.map((album) => (
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
      </div>
    );
  }

  return (
    <Paper className={styles.Section}>
      <Typography variant="h4">Albums</Typography>
      {renderAlbums()}
    </Paper>
  );
}
