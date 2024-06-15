import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import styles from "../../css/AppCreateGroup.module.css";
import { useEffect, useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import ToastUtils from "../../utils/ToastUtils";
import groupService from "../../services/GroupService";
import { Group } from "../../types/GroupType";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppCreateGroup() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    parentGroup: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isAllFieldsFilled = formData.name !== "" && formData.company !== "";
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

  async function createGroup() {
    try {
      setLoading(true);
      if (authToken) {
        const { name, company, parentGroup } = formData;
        const response = await groupService.createGroup(
          name,
          company,
          parentGroup || "",
          imageFile,
          authToken
        );
        if (response) {
          ToastUtils.success("Groupe créé avec succès !");
          setFormData({
            name: "",
            company: "",
            parentGroup: "",
          });
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
    if (formData.name.trim() === "" || formData.company.trim() === "") {
      ToastUtils.error("Veuillez entrer des valeurs valides.");
      return;
    }
    createGroup();
  }

  return (
    <Paper className={styles.PaperContainer}>
      <Typography variant="h5">Créer un groupe</Typography>
      <FormControl className={styles.FormControl} fullWidth variant="outlined">
        <TextField
          className={styles.InputText}
          id="name"
          name="name"
          label="Nom du groupe"
          variant="outlined"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          className={styles.InputText}
          id="company"
          name="company"
          label="Agence/Compagnie"
          variant="outlined"
          fullWidth
          value={formData.company}
          onChange={handleInputChange}
        />
        <Select
          className={styles.InputText}
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
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.InputFile}
          ref={fileInputRef}
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
