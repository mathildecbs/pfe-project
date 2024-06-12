import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";
import artistService from "../services/ArtistService";
import { Artist } from "../types/ArtistType";
import ToastUtils from "../utils/ToastUtils";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../css/AppExploOneArtist.module.css";

export default function AppExploOneArtist() {
  const { idArtist } = useParams();
  const { user } = useAuth();
  const [thisArtist, setThisArtist] = useState<Artist>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtist();
  }, []);

  async function fetchArtist() {
    try {
      if (idArtist) {
        const response = await artistService.getOneArtist(idArtist);
        setThisArtist(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération de l'artiste");
    }
  }

  async function deleteArtist() {
    try {
      if (idArtist && user) {
        const response = await artistService.deleteArtist(idArtist);
        if (response) {
          ToastUtils.success("Suppression de l'artiste");
          navigate(`/exploArtists`);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la suppression de l'artiste");
    }
  }

  if (!thisArtist) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.Container}>
      <div className={styles.ImageContainer}>
        <img
          src={thisArtist.image}
          alt={thisArtist.name}
          className={styles.ArtistImage}
        />
      </div>
      <div className={styles.InfoContainer}>
        <Typography variant="h4" className={styles.ArtistTitle}>
          {thisArtist.name}
        </Typography>
        <Typography variant="body1" className={styles.ReleaseDate}>
          Anniversaire: {thisArtist.birthday}
        </Typography>
        {thisArtist.albums.length ? (
          <Typography variant="body1" className={styles.ArtistName}>
            Artiste: {thisArtist.albums[0].name}
          </Typography>
        ) : (
          ""
        )}
        {thisArtist.main_group ? (
          <Typography variant="body1" className={styles.ArtistName}>
            Groupe principal: {thisArtist.main_group.name}
          </Typography>
        ) : (
          ""
        )}
        <Button color="error" variant="contained" onClick={deleteArtist}>
          Supprimer l'artiste
        </Button>
      </div>
    </Paper>
  );
}
