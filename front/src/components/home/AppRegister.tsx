import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../../css/AppRegister.module.css";
import { useEffect, useState } from "react";
import { hashPassword } from "../../utils/HashUtils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import ToastUtils from "../../utils/ToastUtils";
import userService from "../../services/UserService";

export default function AppRegister() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    description: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const { username, name, password } = formData;
    const isAllFieldsFilled = username !== "" && name !== "" && password !== "";
    setIsFormValid(isAllFieldsFilled);
  }, [formData, imageFile]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function registerUser() {
    try {
      const { username, name, password, description } = formData;
      const hashedPassword = hashPassword(password);
      const tokenAndUser = await userService.createUser(
        username,
        hashedPassword,
        name,
        description || null,
        imageFile
      );
      const newUser = tokenAndUser.user;
      const token = tokenAndUser.access_token;

      login(newUser, token);
      ToastUtils.success(`Bienvenue ${newUser.username} !`);
    } catch (error) {
      ToastUtils.error(
        "Inscription impossible. Veuillez utiliser un autre pseudo."
      );
    }
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
    registerUser();
  }

  return (
    <Paper>
      <div className={styles.InscriptionContainer}>
        <Typography variant="h6">S'inscrire</Typography>
        <FormControl>
          <TextField
            className={styles.InputText}
            id="username"
            name="username"
            label="Pseudo"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            className={styles.InputText}
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            className={styles.InputText}
            id="password"
            name="password"
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            className={styles.InputText}
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />
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
            disabled={!isFormValid}
          >
            S'inscrire
          </Button>
        </FormControl>
      </div>
    </Paper>
  );
}
