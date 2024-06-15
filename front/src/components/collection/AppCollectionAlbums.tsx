import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppCollectionAlbums.module.css";
import { OwnedAlbum } from "../../types/OwnedAlbumType";
import ownedAlbumService from "../../services/OwnedAlbumService";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppExploAlbums() {
  const [ownedAlbums, setOwnedAlbums] = useState<OwnedAlbum[]>([]);
  const { user, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnedAlbums();
  }, []);

  async function fetchOwnedAlbums() {
    try {
      if (user && authToken) {
        const response = await ownedAlbumService.getOwnedAlbums(user.username, authToken);
        setOwnedAlbums(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  function renderAlbums() {
    return (
      <div className={styles.Container}>
        {ownedAlbums.map((ownedAlbum) => (
          <div
            key={ownedAlbum.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneAlbum/${ownedAlbum.album.id}`)}
          >
            <img
              src={ownedAlbum.album.image}
              alt={ownedAlbum.album.name}
              className={styles.AlbumImage}
            />
            <Typography variant="h6" className={styles.ItemText}>
              {ownedAlbum.album.name}
            </Typography>
            <Typography variant="body2" className={styles.VersionText}>
              Versions: {ownedAlbum.version}
            </Typography>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Paper className={styles.Section}>
      <Typography variant="h4">Albums possédés</Typography>
      {renderAlbums()}
    </Paper>
  );
}
