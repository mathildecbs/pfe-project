import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import groupService from "../services/GroupService";
import { Group } from "../types/GroupType";
import ToastUtils from "../utils/ToastUtils";
import { useAuth } from "../contexts/AuthProvider";
import styles from "../css/AppExploOneGroup.module.css";

export default function AppExploOneGroup() {
  const { idGroup } = useParams();
  const { user } = useAuth();
  const [thisGroup, setThisGroup] = useState<Group>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
  }, []);

  async function fetchGroup() {
    try {
      if (idGroup) {
        const response = await groupService.getOneGroup(idGroup);
        setThisGroup(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération du group");
    }
  }

  async function deleteOwnedGroup() {
    try {
      if (idGroup && user) {
        const response = await groupService.deleteGroup(idGroup);
        if (response) {
          ToastUtils.success("Suppression du groupe");
          navigate(`/exploGroups`);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la suppression du groupe");
    }
  }

  if (!thisGroup) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.Container}>
      <div className={styles.ImageContainer}>
        <img
          src={thisGroup.image}
          alt={thisGroup.name}
          className={styles.GroupImage}
        />
      </div>
      <div className={styles.InfoContainer}>
        <Typography variant="h4" className={styles.GroupTitle}>
          {thisGroup.name}
        </Typography>
        <Typography variant="body1" className={styles.ReleaseDate}>
          Agence/Companie: {thisGroup.company}
        </Typography>
        {thisGroup.parent && (
          <Typography variant="body1" className={styles.ArtistName}>
            Groupe parent: {thisGroup.parent.name}
          </Typography>
        )}
        <div className={styles.Members}>
          <Typography variant="body1" component="span">
            Membres:{" "}
          </Typography>
          {thisGroup.members.map((member, index) => (
            <Typography
              key={index}
              variant="body1"
              component="span"
              className={styles.Member}
            >
              {member.name}
              {index < thisGroup.members.length - 1 ? ", " : ""}
            </Typography>
          ))}
        </div>

        <Button color="error" variant="contained" onClick={deleteOwnedGroup}>
          Supprimer le groupe
        </Button>
      </div>
    </Paper>
  );
}
