import React, { useEffect, useState } from "react";
import { Button, Paper, Typography, TextField, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/AppLogin.module.css";
import { useAuth } from "../../contexts/AuthProvider";
import { hashPassword } from "../../utils/HashUtils";
import userService from "../../services/UserService";
import ToastUtils from "../../utils/ToastUtils";

export default function AppLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken !== null) {
      navigate("/");
    }
  });

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      const hashedPassword = hashPassword(password);
      const tokenAndUser = await userService.loginUser(
        username,
        hashedPassword
      );

      const token = tokenAndUser.access_token;
      const newUser = tokenAndUser.user;
      login(newUser, token);
      ToastUtils.success(`Connecté en tant que ${newUser.username}`);
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la connexion.");
    }
  }

  return (
    <Paper className={styles.LoginContainer}>
      <Typography variant="h4" className={styles.Title}>
        Se connecter
      </Typography>
      <form onSubmit={handleLogin}>
        <Box className={styles.FormGroup}>
          <TextField
            label="Nom d'utilisateur"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.Input}
          />
        </Box>
        <Box className={styles.FormGroup}>
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.Input}
          />
        </Box>
        <Box className={styles.FormGroup}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Se connecter
          </Button>
        </Box>
        <Box className={styles.FormGroup}>
          <Typography variant="body2">
            Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
          </Typography>
        </Box>
      </form>
    </Paper>
  );
}
