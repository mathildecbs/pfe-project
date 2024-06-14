import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import styles from "../../css/AppCreateNew.module.css";
import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import ApiUtils from "../../utils/ApiUtils";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";

export default function AppCreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    parentGroup: "",
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isAllFieldsFilled = formData.name !== "" && formData.company !== "";
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

  async function createGroup() {
    try {
      const { name, company, parentGroup } = formData;
      const response = await groupService.createGroup(name, company, parentGroup || "");
      if (response) {
        ToastUtils.success("Groupe créé avec succès !");
        setFormData({
          name: "",
          company: "",
          parentGroup: "",
        });
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

  function handleSubmit() {
    if (formData.name.trim() === "" || formData.company.trim() === "") {
      ToastUtils.error("Veuillez entrer des valeurs valides.");
      return;
    }
    createGroup();
  }

  return (
    <Paper className={styles.createNewContainer}>
      <Typography variant="h5">Créer un groupe</Typography>
      <FormControl className={styles.formControl}>
        <TextField
          className={styles.inputText}
          id="name"
          name="name"
          label="Nom du groupe"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          className={styles.inputText}
          id="company"
          name="company"
          label="Agence/Compagnie"
          variant="outlined"
          fullWidth
          value={formData.company}
          onChange={handleInputChange}
        />
        <Select
          className={styles.inputText}
          id="parentGroup"
          name="parentGroup"
          value={formData.parentGroup}
          onChange={handleSelectChange}
          displayEmpty
          fullWidth
          variant="outlined"
        >
          <MenuItem value="">
            <em>Pas de groupe parent</em>
          </MenuItem>
          {groups &&
            groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
        </Select>
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
