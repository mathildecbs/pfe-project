import React, { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import groupService from "../services/GroupService";
import artistService from "../services/ArtistService";
import albumService from "../services/AlbumService";
import ToastUtils from "../utils/ToastUtils";
import { Artist } from "../types/ArtistType";
import { Group } from "../types/GroupType";
import { Album } from "../types/AlbumType";
import styles from "../css/AppExplorer.module.css"; // Importez le fichier de styles correct

export default function AppExplorer() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [soloArtists, setSoloArtists] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchSoloArtists();
    fetchAlbums();
    fetchArtists();
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

  async function fetchArtists() {
    try {
      const response = await artistService.getArtists();
      setArtists(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des artistes");
    }
  }

  async function fetchAlbums() {
    try {
      const response = await albumService.getAlbums();
      setAlbums(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  function renderGroupAndSoloArtists() {
    const combined = [...groups, ...soloArtists];

    return (
      <div className={styles.Container}>
        {combined.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className={styles.ItemCard}
            onClick={() => {
              if ("main_group" in item && item.main_group) {
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
        <Button className={styles.MoreButton} onClick={() => navigate("/exploGroups")}>
          Plus...
        </Button>
      </div>
    );
  }

  function renderArtists() {
    return (
      <div className={styles.Container}>
        {artists.slice(0, 4).map((artist) => (
          <div key={artist.id} className={styles.ItemCard} onClick={() => navigate(`/exploOneArtist/${artist.id}`)}>
            <Typography variant="h6" className={styles.ItemText}>{artist.name}</Typography>
          </div>
        ))}
          <Button
            className={styles.MoreButton}
            onClick={() => navigate("/exploArtists")}
          >
            Plus...
          </Button>
      </div>
    );
  };

  function renderAlbums() {
    return (
      <div className={styles.Container}>
        {albums.slice(0, 4).map((album) => (
          <div key={album.id} className={styles.ItemCard} onClick={() => navigate(`/exploOneAlbum/${album.id}`)}>
            <Typography variant="h6" className={styles.ItemText}>{album.name}</Typography>
          </div>
        ))}
          <Button
            className={styles.MoreButton}
            onClick={() => navigate("/exploAlbums")}
          >
            Plus...
          </Button>
      </div>
    );
  };

  return (
    <>
      <Paper className={styles.Section}>
        <Typography variant="h4">Groupes et soloistes</Typography>
        {renderGroupAndSoloArtists()}
      </Paper>
      <Paper className={styles.Section}>
        <Typography variant="h4">Artistes</Typography>
        {renderArtists()}
      </Paper>
      <Paper className={styles.Section}>
        <Typography variant="h4">Albums</Typography>
        {renderAlbums()}
      </Paper>
    </>
  );
}
