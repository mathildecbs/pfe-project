import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import styles from "../../css/AppExploOneGroup.module.css";

export default function AppExploOneGroup() {
  const { idGroup } = useParams();
  const { user, authToken } = useAuth();
  const [thisGroup, setThisGroup] = useState<Group>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
  }, []);

  async function fetchGroup() {
    try {
      if (idGroup && authToken) {
        const response = await groupService.getOneGroup(idGroup, authToken);
        setThisGroup(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération du groupe");
    }
  }

  async function deleteOwnedGroup() {
    try {
      if (idGroup && authToken) {
        const response = await groupService.deleteGroup(idGroup, authToken);
        if (response) {
          ToastUtils.success("Suppression du groupe");
          navigate(`/exploGroups`);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la suppression du groupe");
    }
  }

  function navigateTo(artistId: string) {
    navigate(`/exploOneArtist/${artistId}`);
  }

  if (!thisGroup) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.Container}>
      <div className={styles.ImageContainer}>
        <img
          src={thisGroup.image || "/path/to/default/image.jpg"}
          alt={thisGroup.name}
          className={styles.GroupImage}
        />
      </div>
      <div className={styles.InfoContainer}>
        <Typography variant="h4" className={styles.GroupTitle}>
          {thisGroup.name}
        </Typography>
        <Typography variant="body1" className={styles.ReleaseDate}>
          Agence/Compagnie: {thisGroup.company}
        </Typography>
        {thisGroup.parent && (
          <Typography variant="body1" className={styles.ArtistName}>
            Groupe parent: {thisGroup.parent.name}
          </Typography>
        )}
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Membres
          </Typography>
          {thisGroup.members.length ? (
            <div className={styles.MembersContainer}>
              {thisGroup.members.map((member) => (
                <Typography
                  key={member.id}
                  variant="body1"
                  onClick={() => navigateTo(member.id)}
                  className={styles.MemberName}
                >
                  {member.name}
                </Typography>
              ))}
            </div>
          ) : (
            <Typography variant="body2" className={styles.NoItems}>
              Aucun membre disponible
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Albums
          </Typography>
          {thisGroup.albums.length ? (
            <div className={styles.AlbumsContainer}>
              {thisGroup.albums.map((album) => (
                <div key={album.id} className={styles.AlbumCard}>
                  <img
                    src={album.image}
                    alt={album.name}
                    className={styles.AlbumImage}
                  />
                  <Typography variant="body2" className={styles.AlbumName}>
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
        <Button color="error" variant="contained" onClick={deleteOwnedGroup}>
          Supprimer le groupe
        </Button>
      </div>
    </Paper>
  );
}
