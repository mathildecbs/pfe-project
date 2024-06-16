import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import artistService from "../../services/ArtistService";
import { Artist } from "../../types/ArtistType";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import styles from "../../css/AppExploOneArtist.module.css";

export default function AppExploOneArtist() {
  const { idArtist } = useParams();
  const { authToken, user } = useAuth();
  const [thisArtist, setThisArtist] = useState<Artist>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtist();
  }, []);

  async function fetchArtist() {
    try {
      if (idArtist && authToken) {
        const response = await artistService.getOneArtist(idArtist, authToken);
        setThisArtist(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération de l'artiste");
    }
  }

  async function deleteArtist() {
    try {
      if (idArtist && authToken) {
        const response = await artistService.deleteArtist(idArtist, authToken);
        if (response) {
          ToastUtils.success("Suppression de l'artiste");
          navigate(`/exploArtists`);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la suppression de l'artiste");
    }
  }

  function navigateTo(root: string, specification: string) {
    navigate(`/${root}/${specification}`);
  }

  if (!thisArtist) {
    return <CircularProgress />;
  }

  const secondaryGroups = thisArtist.groups.filter(
    (group) => group.id !== thisArtist.main_group?.id
  );

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
        {thisArtist.main_group && (
          <Typography variant="body1" className={styles.ArtistName}>
            Groupe principal: {thisArtist.main_group.name}
          </Typography>
        )}
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Groupes secondaires
          </Typography>
          {secondaryGroups.length ? (
            <div className={styles.AlbumsContainer}>
              {secondaryGroups.map((group) => (
                <div
                  key={group.id}
                  className={styles.AlbumCard}
                  onClick={() =>
                    navigateTo("exploOneGroup", group.id.toString())
                  }
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className={styles.AlbumImage}
                  />
                  <Typography variant="body2" className={styles.ItemName}>
                    {group.name}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="body2" className={styles.NoItems}>
              Aucun groupe secondaire disponible
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Albums
          </Typography>
          {thisArtist.albums.length ? (
            <div className={styles.ItemsContainer}>
              {thisArtist.albums.map((album) => (
                <div
                  key={album.id}
                  className={styles.ItemCard}
                  onClick={() =>
                    navigateTo("exploOneAlbum", album.id.toString())
                  }
                >
                  <img
                    src={album.image}
                    alt={album.name}
                    className={styles.AlbumImage}
                  />
                  <Typography variant="body2" className={styles.ItemName}>
                    {album.name}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="body2" className={styles.NoItems}>
              Aucun album disponible
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Inclusions
          </Typography>
          {thisArtist.inclusions.length ? (
            <div className={styles.ItemsContainer}>
              {thisArtist.inclusions.map((inclusion) => (
                <div
                  key={inclusion.id}
                  className={styles.ItemCard}
                  onClick={() =>
                    navigateTo("exploOneInclusion", inclusion.id.toString())
                  }
                >
                  <img
                    src={inclusion.image}
                    alt={inclusion.name}
                    className={styles.ItemImage}
                  />
                  <Typography variant="body2" className={styles.ItemName}>
                    {inclusion.name}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="body2" className={styles.NoItems}>
              Aucune inclusion disponible
            </Typography>
          )}
        </div>
        {user?.isAdmin && (
          <Button color="error" variant="contained" onClick={deleteArtist}>
            Supprimer l'artiste
          </Button>
        )}
      </div>
    </Paper>
  );
}
