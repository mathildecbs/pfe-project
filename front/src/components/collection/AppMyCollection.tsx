import { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ToastUtils from "../../utils/ToastUtils";
import { Artist } from "../../types/ArtistType";
import { Group } from "../../types/GroupType";
import styles from "../../css/AppExplorer.module.css";
import ownedInclusionService from "../../services/OwnedInclusionService";
import ownedAlbumService from "../../services/OwnedAlbumService";
import { OwnedAlbum } from "../../types/OwnedAlbumType";
import { useAuth } from "../../contexts/AuthProvider";
import { OwnedInclusion } from "../../types/OwnedInclusionType";

export default function AppMyCollection() {
  const [ownedInclusions, setOwnedInclusions] = useState<OwnedInclusion[]>([]);
  const [ownedAlbums, setOwnedAlbums] = useState<OwnedAlbum[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnedAlbums();
    fetchOwnedInclusions();
  }, []);

  async function fetchOwnedAlbums() {
    try {
      if (user) {
        const response = await ownedAlbumService.getOwnedAlbums(user.username);
        setOwnedAlbums(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  async function fetchOwnedInclusions() {
    try {
      if (user) {
        const response = await ownedInclusionService.getOwnedInclusions(
          user.username
        );
        setOwnedInclusions(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des artistes");
    }
  }

  function renderInclusions() {
    return (
      <div className={styles.Container}>
        {ownedInclusions.slice(0, 4).map((inclusion) => (
          <div
            key={inclusion.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneInclusion/${inclusion.id}`)}
          >
            <Typography variant="h6" className={styles.ItemText}>
              {inclusion.inclusion.name}
            </Typography>
          </div>
        ))}
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
        {ownedAlbums.slice(0, 4).map((album) => (
          <div
            key={album.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneAlbum/${album.album.id}`)}
          >
            <Typography variant="h6" className={styles.ItemText}>
              {album.album.name}
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
        <Typography variant="h4">Albums</Typography>
        {renderAlbums()}
      </Paper>
      <Paper className={styles.Section}>
        <Typography variant="h4">Inclusions</Typography>
        {renderInclusions()}
      </Paper>
    </>
  );
}
