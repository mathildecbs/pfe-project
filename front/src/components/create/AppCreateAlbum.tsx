import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Checkbox,
  Grid,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import styles from "../../css/AppCreateNew.module.css";
import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import ApiUtils from "../../utils/ApiUtils";
import artistService from "../../services/ArtistService";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import { Artist } from "../../types/ArtistType";

export default function AppCreateAlbum() {
  const [formData, setFormData] = useState({
    name: "",
    releaseDate: "",
    solo: false,
    artist: "",
    group: "",
    versions: [] as string[],
    version: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const isAllFieldsFilled =
      formData.name !== "" &&
      formData.releaseDate !== "" &&
      (formData.artist !== "" || formData.group !== "");
    setIsFormValid(isAllFieldsFilled);
  }, [formData]);

  useEffect(() => {
    fetchGroups();
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

  async function fetchArtists() {
    try {
      const response = await artistService.getArtists();
      setArtists(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des artistes");
    }
  }

  function handleArtistChange(event: SelectChangeEvent<string>) {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      artist: value,
    }));
  }

  function handleGroupChange(event: SelectChangeEvent<string>) {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      group: value,
    }));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
      artist: checked ? "" : prevState.artist,
      group: checked ? prevState.group : "",
    }));
  }

  function handleAddVersion() {
    if (formData.version.trim() === "") {
      ToastUtils.error("Veuillez entrer un nom de version ou laisser vide si album sans version.");
      return;
    }
  
    if (formData.versions.includes(formData.version)) {
      ToastUtils.error("La version existe déjà");
      return;
    }
  
    setFormData((prevState) => ({
      ...prevState,
      versions: [...prevState.versions, prevState.version],
      version: "",
    }));
  }
  

  function handleRemoveVersion(versionToRemove: string) {
    setFormData((prevState) => ({
      ...prevState,
      versions: prevState.versions.filter((version) => version !== versionToRemove),
    }));
  }

  async function createAlbum() {
    try {
      const { name, releaseDate, solo, versions, artist, group } = formData;
      const response = await ApiUtils.getApiInstanceJson().post("/album", {
        name: name,
        release_date: releaseDate,
        solo: solo,
        versions: versions,
        artist: artist,
        group: group,
      });
      if (response) {
        ToastUtils.success("Album créé avec succès !");
        setFormData({
          name: "",
          releaseDate: "",
          solo: false,
          artist: "",
          group: "",
          versions: [],
          version: "",
        });
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
    }
  }

  function handleSubmit() {
    createAlbum();
  }

  return (
    <Paper>
      <Typography variant="h5">Créer un album</Typography>
      <FormControl>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.solo}
                  onChange={handleCheckboxChange}
                  name="solo"
                />
              }
              label="Soloiste"
            />
          </Grid>
          <Grid item xs={6}>
            {formData.solo ? (
              <Select
                className={styles.InputText}
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleArtistChange}
                displayEmpty
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Sélectionner un artiste</em>
                </MenuItem>
                {artists.map((artist) => (
                  <MenuItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Select
                className={styles.InputText}
                id="group"
                name="group"
                value={formData.group}
                onChange={handleGroupChange}
                displayEmpty
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">
                  <em>Sélectionner un groupe</em>
                </MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
        </Grid>
        <TextField
          className={styles.InputText}
          id="name"
          name="name"
          label="Nom de l'album"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          className={styles.InputText}
          id="releaseDate"
          name="releaseDate"
          label="Date de sortie"
          variant="outlined"
          type="date"
          fullWidth
          value={formData.releaseDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={10}>
            <TextField
              className={styles.InputText}
              id="version"
              name="version"
              label="Version"
              variant="outlined"
              fullWidth
              value={formData.version}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="primary" onClick={handleAddVersion}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        <List>
          {formData.versions.map((version, index) => (
            <ListItem key={index}>
              <ListItemText primary={version} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveVersion(version)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Créer
        </Button>
      </FormControl>
    </Paper>
  );
}
