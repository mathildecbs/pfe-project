import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import styles from "../../css/AppCreateArtist.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState, useRef } from "react";
import ToastUtils from "../../utils/ToastUtils";
import artistService from "../../services/ArtistService";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import { Add, Delete } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppCreateArtist() {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    mainGroup: null as string | null,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isAllFieldsFilled = formData.name !== "" && formData.birthday !== "";
    setIsFormValid(isAllFieldsFilled && imageFile !== null);
  }, [formData, imageFile]);

  useEffect(() => {
    fetchGroups();
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

  async function createArtist() {
    try {
      setLoading(true);
      const { name, birthday, mainGroup } = formData;
      const groupIds = selectedGroups.map((group) => group.id);
      if (mainGroup !== null && mainGroup !== "") {
        groupIds.push(mainGroup);
      }
      if (authToken) {
        const response = await artistService.createArtist(
          name,
          birthday,
          mainGroup === "" ? null : mainGroup,
          groupIds,
          imageFile,
          authToken
        );

        if (response) {
          ToastUtils.success("Artiste créé avec succès !");
          setFormData({
            name: "",
            birthday: "",
            mainGroup: null,
          });
          setSelectedGroups([]);
          setSelectedGroup("");
          setImageFile(null);
          setImageName("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSelectChange(event: SelectChangeEvent<string>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name as string]: value,
    }));
  }

  function handleGroupSelectChange(event: SelectChangeEvent<string>) {
    setSelectedGroup(event.target.value);
  }

  function addGroup() {
    const groupToAdd = groups.find((group) => group.id === selectedGroup);
    if (
      groupToAdd &&
      !selectedGroups.some((group) => group.id === groupToAdd.id)
    ) {
      setSelectedGroups((prevState) => [...prevState, groupToAdd]);
      setSelectedGroup("");
    }
  }

  function removeGroup(groupId: string) {
    setSelectedGroups((prevState) =>
      prevState.filter((group) => group.id !== groupId)
    );
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

  function handleSubmit() {
    if (formData.name.trim() === "") {
      ToastUtils.error("Veuillez entrer un nom d'artiste valide.");
      return;
    }

    createArtist();
  }

  const availableGroupsForMain = groups.filter(
    (group) =>
      !selectedGroups.some((selectedGroup) => selectedGroup.id === group.id)
  );
  const availableGroupsForSelect = groups.filter(
    (group) =>
      group.id !== formData.mainGroup &&
      !selectedGroups.some((selectedGroup) => selectedGroup.id === group.id)
  );

  return (
    <Paper className={styles.PaperContainer}>
      <Typography variant="h5">Créer un artiste</Typography>
      <FormControl fullWidth margin="normal">
        <TextField
          className={styles.InputText}
          id="name"
          name="name"
          label="Nom de scène"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          className={styles.InputText}
          id="birthday"
          name="birthday"
          label="Anniversaire"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          type="date"
          fullWidth
          value={formData.birthday}
          onChange={handleInputChange}
        />
        <Select
          className={styles.InputText}
          id="mainGroup"
          name="mainGroup"
          value={formData.mainGroup === null ? "" : formData.mainGroup}
          onChange={handleSelectChange}
          displayEmpty
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">
            <em>Pas de groupe principal</em>
          </MenuItem>
          {availableGroupsForMain.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
        <div className={styles.Groups}>
          <Select
            className={styles.InputText}
            id="group"
            name="group"
            value={selectedGroup}
            onChange={handleGroupSelectChange}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">
              <em>Pas de groupe secondaire</em>
            </MenuItem>
            {availableGroupsForSelect.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
          <IconButton
            color="primary"
            disabled={!selectedGroup}
            onClick={addGroup}
          >
            <Add />
          </IconButton>
        </div>
        <List>
          {selectedGroups.map((group) => (
            <ListItem key={group.id}>
              {group.name}
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeGroup(group.id)}
              >
                <Delete />
              </IconButton>
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
