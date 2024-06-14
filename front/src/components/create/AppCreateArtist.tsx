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
  Grid,
} from "@mui/material";
import styles from "../../css/AppCreateNew.module.css";
import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import ApiUtils from "../../utils/ApiUtils";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import { Add, Delete } from "@mui/icons-material";
import artistService from "../../services/ArtistService";

export default function AppCreateArtist() {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    mainGroup: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    const isAllFieldsFilled = formData.name !== "" && formData.birthday !== "";
    setIsFormValid(isAllFieldsFilled);
  }, [formData]);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const response = await groupService.getGroups();
      setGroups(response);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des groupes");
    }
  }

  async function createArtist() {
    try {
      const { name, birthday, mainGroup } = formData;
      const groupIds = selectedGroups.map((group) => group.id);
      if (mainGroup !== null && mainGroup !== "") {
        groupIds.push(mainGroup);
      }

      const response = await artistService.createArtist(
        name,
        birthday,
        mainGroup === "" ? null : mainGroup,
        groupIds
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
      }
    } catch (error) {
      ToastUtils.error("Problème lors de la création.");
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
    <Paper>
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
      </FormControl>
      <FormControl fullWidth margin="normal">
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
      </FormControl>
      <FormControl fullWidth margin="normal">
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
      </FormControl>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <FormControl fullWidth margin="normal">
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
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            color="primary"
            disabled={!selectedGroup}
            onClick={addGroup}
          >
            <Add />
          </IconButton>
        </Grid>
      </Grid>
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        Créer
      </Button>
    </Paper>
  );
}
