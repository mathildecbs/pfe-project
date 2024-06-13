import { useEffect, useState } from "react";
import { Group } from "../../types/GroupType";
import groupService from "../../services/GroupService";
import ToastUtils from "../../utils/ToastUtils";
import { Button, Paper, Typography } from "@mui/material";
import artistService from "../../services/ArtistService";
import { Artist } from "../../types/ArtistType";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppExploGroups.module.css";

export default function AppExploGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [soloArtists, setSoloArtists] = useState<Artist[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchSoloArtists();
  }, []);

  async function fetchGroups() {
    try {
      const response = await groupService.getGroups();
      setGroups(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des groupes");
    }
  }

  async function fetchSoloArtists() {
    try {
      const response = await artistService.getSoloArtists();
      setSoloArtists(response);
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
