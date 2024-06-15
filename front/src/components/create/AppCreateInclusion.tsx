import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../../css/AppCreateInclusion.module.css";
import ToastUtils from "../../utils/ToastUtils";
import { Album } from "../../types/AlbumType";
import { InclusionEnum } from "../../enums/InclusionEnum";
import albumService from "../../services/AlbumService";
import groupService from "../../services/GroupService";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import inclusionService from "../../services/InclusionService";
import { useAuth } from "../../contexts/AuthProvider";
import { Group } from "../../types/GroupType";

export default function AppCreateInclusion() {
  const [formData, setFormData] = useState({
    name: "",
    album: "",
    member: "",
    type: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every(
      (val) => val !== ""
    );
    setIsFormValid(isAllFieldsFilled && imageFile !== null);
  }, [formData, imageFile]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      if (authToken) {
        const response = await albumService.getAlbums(authToken);
        setAlbums(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  async function fetchMembers(albumId: string) {
    try {
      if (authToken) {
        const response = await albumService.getOneAlbum(albumId, authToken);
        const album = response;
        if (album.artist) {
          setMembers([{ id: album.artist.id, name: album.artist.name }]);
        } else if (album.group && album.group.id) {
          const groupResponse = (await groupService.getOneGroup(
            album.group.id,
            authToken
          )) as Group;
          const memberNames = groupResponse.members.map((member) => ({
            id: member.id,
            name: member.name,
          }));
          setMembers(memberNames);
        }
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la récupération des membres liés à l'album"
      );
    }
  }

  async function createInclusion() {
    try {
      setLoading(true);
      if (authToken) {
        const { name, album, member, type } = formData;
        const response = await inclusionService.createInclusion(
          name,
          album,
          member,
          type,
          imageFile,
          authToken
        );
        if (response) {
          ToastUtils.success("Inclusion créée avec succès !");
          resetForm();
        }
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  function handleAlbumChange(event: SelectChangeEvent<string>) {
    const albumId = event.target.value;
    const selectedAlbum = albums.find((album) => album.id === albumId);
    setSelectedAlbum(selectedAlbum || null);
    setFormData((prevState) => ({
      ...prevState,
      album: albumId,
    }));
    fetchMembers(albumId);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  function resetForm() {
    setFormData({
      name: "",
      album: "",
      member: "",
      type: "",
    });
    setSelectedAlbum(null);
    setMembers([]);
    setImageFile(null);
    setImageName("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formData.name.trim() === "") {
      ToastUtils.error("Veuillez entrer un nom valide.");
      return;
    }
    createInclusion();
  }

  return (
    <Paper className={styles.PaperContainer}>
      <Typography variant="h5">Créer une inclusion</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl
          fullWidth
          variant="outlined"
          className={styles.FormControl}
        >
          <InputLabel id="album-label">Album lié</InputLabel>
          <Select
            labelId="album-label"
            id="album"
            name="album"
            value={formData.album}
            className={styles.TextField}
            onChange={handleAlbumChange}
            label="Album lié"
            fullWidth
          >
            {albums.map((album) => (
              <MenuItem key={album.id} value={album.id}>
                {album.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            id="name"
            name="name"
            label="Nom de l'inclusion"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
            value={formData.name}
            className={styles.TextField}
          />
          <TextField
            id="type"
            name="type"
            label="Type d'inclusion"
            variant="outlined"
            fullWidth
            select
            className={styles.TextField}
            value={formData.type}
            onChange={handleInputChange}
          >
            {Object.values(InclusionEnum).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="member"
            name="member"
            label="Membre lié"
            variant="outlined"
            fullWidth
            select
            className={styles.TextField}
            disabled={!selectedAlbum}
            value={formData.member}
            onChange={handleInputChange}
          >
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </TextField>
          <div className={styles.FileInputContainer}>
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
                <Typography>
                  <AttachFileIcon className={styles.FileIcon} /> {imageName}
                  <CancelIcon
                    className={styles.CancelIcon}
                    onClick={handleRemoveImage}
                  />
                </Typography>
              )}
            </label>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={styles.SubmitButton}
            disabled={!isFormValid || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Créer"}
          </Button>
        </FormControl>
      </form>
    </Paper>
  );
}
