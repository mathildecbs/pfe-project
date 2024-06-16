import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import userService from "../../services/UserService";
import ToastUtils from "../../utils/ToastUtils";
import styles from "../../css/AppUpdateProfile.module.css";
import { useAuth } from "../../contexts/AuthProvider";
import { User } from "../../types/UserType";
import { hashPassword } from "../../utils/HashUtils";

export default function AppUpdateProfile() {
  const { user, authToken } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    description: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [passwordData, setPasswordData] = useState({
    password: ""
  });
  const [editMode, setEditMode] = useState({
    name: false,
    description: false
  });
  const [changePassword, setChangePassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setInitialFormData({
        name: user.name,
        description: user.description || ""
      });
      setFormData({
        name: user.name,
        description: user.description || ""
      });
      setImagePreview(user.image || null);
    }
  }, [user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authToken) {
        await userService.updateUser(
          user!.username,
          formData.name,
          formData.description,
          imageFile,
          authToken
        );
        ToastUtils.success("Profil modifié !");
      }
    } catch (error) {
      ToastUtils.error("Erreur lors de la modification du profil");
    }

    if (changePassword && passwordData.password && authToken) {
      try {
        const hashedPassword = hashPassword(passwordData.password);
        await userService.updatePassword(user!.username, hashedPassword, authToken);
        ToastUtils.success("Mot de passe modifié !");
      } catch (error) {
        ToastUtils.error("Erreur lors de la modification du mot de passe");
      }
    }
  };

  const isFormChanged = () => {
    return (
      formData.name !== initialFormData.name ||
      formData.description !== initialFormData.description ||
      (changePassword && passwordData.password) ||
      imageFile
    );
  };

  if (!profileData) return null;

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.UserPhoto}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={profileData.username}
              className={styles.ProfilePhoto}
            />
          ) : (
            <Avatar className={`${styles.DefaultAvatar} ${styles.UserDefault}`}>
              {profileData.username.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </div>
        <div className={styles.UserInfo}>
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            className={styles.InputFile}
            onChange={handleImageChange}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              className={styles.IconButton}
            >
              <AddPhotoAlternateIcon className={styles.PhotoIcon} />
            </IconButton>
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.Form}>
        <div className={styles.FormField}>
          <Typography className={styles.HeadersTitle} variant="h5">Nom</Typography>
          {editMode.name ? (
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          ) : (
            <Typography variant="body1">{formData.name}</Typography>
          )}
          <IconButton onClick={() => setEditMode({ ...editMode, name: !editMode.name })}>
            <EditIcon />
          </IconButton>
        </div>
        <div className={styles.FormField}>
          <Typography className={styles.HeadersTitle} variant="h5">Description </Typography>
          {editMode.description ? (
            <TextField
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          ) : (
            <Typography variant="body1">{formData.description}</Typography>
          )}
          <IconButton onClick={() => setEditMode({ ...editMode, description: !editMode.description })}>
            <EditIcon />
          </IconButton>
        </div>
        <div className={styles.FormField}>
          {changePassword ? (
            <TextField
              name="password"
              label="Nouveau mot de passe"
              value={passwordData.password}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              type="password"
            />
          ) : (
            <Button onClick={() => setChangePassword(true)}>Changer de mot de passe</Button>
          )}
        </div>
        <Button type="submit" variant="contained" color="primary" disabled={!isFormChanged()}>
          Mettre à jour le profil
        </Button>
      </form>
    </div>
  );
}
