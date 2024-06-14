import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../../css/AppCreateNew.module.css";
import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import ApiUtils from "../../utils/ApiUtils";
import { Album } from "../../types/AlbumType";
import albumService from "../../services/AlbumService";
import { InclusionEnum } from "../../enums/InclusionEnum";
import { Group } from "../../types/GroupType";
import groupService from "../../services/GroupService";
import inclusionService from "../../services/InclusionService";

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

  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every(
      (val) => val !== ""
    );
    setIsFormValid(isAllFieldsFilled);
  }, [formData]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  async function fetchAlbums() {
    try {
      const response = await albumService.getAlbums();
      setAlbums(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des albums");
    }
  }

  async function fetchMembers(albumId: string) {
    try {
      const response = await albumService.getOneAlbum(albumId);
      const album = response;
      if (album.artist) {
        setMembers([{ id: album.artist.id, name: album.artist.name }]);
      } else if (album.group && album.group.id) {
        const groupResponse = (await groupService.getOneGroup(
          album.group.id
        )) as Group;
        const memberNames = groupResponse.members.map((member) => ({
          id: member.id,
          name: member.name,
        }));
        setMembers(memberNames);
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
      const { name, album, member, type } = formData;
      const response = await inclusionService.createInclusion(
        name,
        album,
        member,
        type
      );
      if (response) {
        ToastUtils.success("Inclusion créée avec succès !");
        resetForm();
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
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

  function resetForm() {
    setFormData({
      name: "",
      album: "",
      member: "",
      type: "",
    });
    setSelectedAlbum(null);
    setMembers([]);
  }

  function handleSubmit() {
    if (formData.name.trim() === "") {
      ToastUtils.error("Veuillez entrer un nom valide.");
      return;
    }
    createInclusion();
  }

  return (
    <Paper>
      <Typography variant="h5">Créer une inclusion</Typography>
      <FormControl>
        <InputLabel id="album-label">Album lié</InputLabel>
        <Select
          className={styles.InputText}
          labelId="album-label"
          id="album"
          name="album"
          value={formData.album}
          onChange={handleAlbumChange}
          variant="outlined"
          fullWidth
        >
          {albums.map((album) => (
            <MenuItem key={album.id} value={album.id}>
              {album.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          className={styles.InputText}
          id="name"
          name="name"
          label="Nom de l'inclusion"
          variant="outlined"
          fullWidth
          onChange={handleInputChange}
          value={formData.name}
        />
        <TextField
          className={styles.InputText}
          id="type"
          name="type"
          label="Type d'inclusion"
          variant="outlined"
          fullWidth
          select
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
          className={styles.InputText}
          id="member"
          name="member"
          label="Membre lié"
          variant="outlined"
          fullWidth
          select
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
