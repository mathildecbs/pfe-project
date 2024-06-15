import { useEffect, useState } from "react";
import artistService from "../../services/ArtistService";
import ToastUtils from "../../utils/ToastUtils";
import { Paper, Typography } from "@mui/material";
import { Artist } from "../../types/ArtistType";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppExploArtists.module.css";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppExploArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    fetchArtists();
  }, []);

  async function fetchArtists() {
    try {
      if (authToken) {
        const response = await artistService.getArtists(authToken);
        setArtists(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des soloistes");
    }
  }

  function renderSoloArtists() {
    return (
      <div className={styles.Container}>
        {artists.map((artist) => (
          <div
            key={artist.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneArtist/${artist.id}`)}
          >
            <Typography variant="h6" className={styles.ItemText}>
              {artist.name}
            </Typography>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Paper className={styles.Section}>
      <Typography variant="h4">Artistes</Typography>
      {renderSoloArtists()}
    </Paper>
  );
}
