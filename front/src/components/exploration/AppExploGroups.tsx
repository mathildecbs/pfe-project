import { useEffect, useState } from "react";
import { Group } from "../../types/GroupType";
import groupService from "../../services/GroupService";
import ToastUtils from "../../utils/ToastUtils";
import { Paper, Typography } from "@mui/material";
import artistService from "../../services/ArtistService";
import { Artist } from "../../types/ArtistType";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppExploGroups.module.css";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppExploGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [soloArtists, setSoloArtists] = useState<Artist[]>([]);
  const navigate = useNavigate();
  const { authToken } = useAuth();

  useEffect(() => {
    fetchGroups();
    fetchSoloArtists();
  }, []);

  async function fetchGroups() {
    try {
      if (authToken) {
        const response = await groupService.getGroups(authToken);
        setGroups(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des groupes");
    }
  }

  async function fetchSoloArtists() {
    try {
      if (authToken) {
        const response = await artistService.getSoloArtists(authToken);
        setSoloArtists(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des soloistes");
    }
  }

  function renderGroupAndSoloArtists() {
    const combined = [...groups, ...soloArtists];

    return (
      <div className={styles.Container}>
        {combined.map((item) => (
          <div
            key={item.id}
            className={styles.ItemCard}
            onClick={() => {
              if ("main_group" in item) {
                navigate(`/exploOneArtist/${item.id}`);
              } else {
                navigate(`/exploOneGroup/${item.id}`);
              }
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className={styles.ItemImage}
            />
            <Typography variant="h6" className={styles.ItemText}>
              {item.name}
            </Typography>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Paper className={styles.Section}>
      <Typography variant="h4">Groupes et soloistes</Typography>
      {renderGroupAndSoloArtists()}
    </Paper>
  );
}
