import {
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../css/AppRegister.module.css";
import { useEffect, useState } from "react";
import ApiUtils from "../utils/ApiUtils";
import { hashPassword } from "../utils/HashUtils";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { User } from "../types/UserType";
import ToastUtils from "../utils/ToastUtils";

export default function AppRegister() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    description: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  });

  useEffect(() => {
    const isAllFieldsFilled = Object.values(formData).every(
      (val) => val !== ""
    );
    setIsFormValid(isAllFieldsFilled);
  }, [formData]);

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
      const response = await ApiUtils.getApiInstanceJson().post("/user", {
        username: username,
        password: hashedPassword,
        name: name,
        description: description,
      });
      const newUSer = response.data as User;

      const tokenRes = await ApiUtils.getApiInstanceJson().post("/user/login", {
        username: username,
        password: hashedPassword,
      });

      const token = tokenRes.data;

      login(newUSer, token);
    } catch (error) {
      ToastUtils.error("Inscription impossible. Veuillez utiliser un autre pseudo.");
    }
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
