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

  async function deleteGroup() {
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

  function navigateTo(root: string, artistId: string) {
    navigate(`/${root}/${artistId}`);
  }

  if (!thisGroup) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.PaperContainer}>
      <div className={styles.Container}>
        <img
          src={thisGroup.image}
          alt={thisGroup.name}
          className={styles.GroupImage}
        />
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
                    onClick={() => navigateTo("exploOneArtist", member.id)}
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
        </div>
      </div>
      <div className={styles.SecondContainer}>
        <div>
          <Typography variant="h5" className={styles.Subtitle}>
            Albums
          </Typography>
          {thisGroup.albums.length ? (
            <div className={styles.AlbumsContainer}>
              {thisGroup.albums.map((album) => (
                <div
                  key={album.id}
                  className={styles.AlbumCard}
                  onClick={() => navigateTo("exploOneAlbum", album.id)}
                >
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
        {user?.isAdmin && (
          <Button color="error" variant="contained" onClick={deleteGroup}>
            Supprimer le groupe au complet définitivement
          </Button>
        )}
      </div>
    </Paper>
  );
}
