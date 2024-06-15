import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "../../css/AppCreateAlbum.module.css";
import ToastUtils from "../../utils/ToastUtils";
import albumService from "../../services/AlbumService";
import artistService from "../../services/ArtistService";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import { Artist } from "../../types/ArtistType";
import { useAuth } from "../../contexts/AuthProvider";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const isAllFieldsFilled =
      formData.name !== "" &&
      formData.releaseDate !== "" &&
      (formData.artist !== "" || formData.group !== "");
    setIsFormValid(isAllFieldsFilled && imageFile !== null);
  }, [formData, imageFile]);

  useEffect(() => {
    fetchGroups();
    fetchArtists();
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

  async function fetchArtists() {
    try {
      if (authToken) {
        const response = await artistService.getArtists(authToken);
        setArtists(response);
      }
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
      ToastUtils.error(
        "Veuillez entrer un nom de version ou laisser vide si album sans version."
      );
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
      versions: prevState.versions.filter(
        (version) => version !== versionToRemove
      ),
    }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setImageName(file.name);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImageName("");
  }

  async function createAlbum() {
    setLoading(true);
    try {
      if (authToken) {
        const { name, releaseDate, solo, versions, artist, group } = formData;
        const response = await albumService.createAlbum(
          name,
          releaseDate,
          solo,
          versions,
          artist,
          group,
          imageFile,
          authToken
        );

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
          setImageFile(null);
          setImageName("");
        }
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (formData.name.trim() === "") {
      ToastUtils.error("Veuillez entrer un nom d'album valide.");
      return;
    }
    createAlbum();
  }

  return (
    <Paper className={styles.PaperContainer}>
      <Typography variant="h5">Créer un album</Typography>
      <FormControl className={styles.FormControl} fullWidth variant="outlined">
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
        <div className={styles.Versions}>
          <TextField
            id="version"
            name="version"
            label="Version"
            variant="outlined"
            fullWidth
            value={formData.version}
            onChange={handleInputChange}
          />
          <IconButton color="primary" onClick={handleAddVersion}>
            <Add />
          </IconButton>
        </div>
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
        <input
          type="file"
          accept="image/*"
          id="imageFile"
          onChange={handleFileChange}
          className={styles.InputFile}
        />
        <label htmlFor="imageFile">
          <Button
            variant="contained"
            component="span"
            color="primary"
            className={styles.FileInputButton}
          >
            Sélectionner une image
          </Button>
          {imageName && (
            <Typography className={styles.FileName}>
              <AttachFileIcon className={styles.FileIcon} /> {imageName}
              <CancelIcon
                className={styles.CancelIcon}
                onClick={handleRemoveImage}
              />
            </Typography>
          )}
        </label>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Créer"}
        </Button>
      </FormControl>
    </Paper>
  );
}
