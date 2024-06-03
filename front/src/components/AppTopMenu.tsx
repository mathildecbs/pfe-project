import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import styles from "../css/AppTopMenu.module.css";
import { Search } from "@mui/icons-material";
import { useAuth } from "../auth/AuthProvider";
import { Link } from "react-router-dom";

export default function AppTopMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function hangleLogoutClick() {
    logout();
    handleMenuClose();
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar className={styles.TopMenu}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Kollection
        </Typography>
        <div>
          {user && (
            <>
              <InputBase
                className={styles.SearchBar}
                placeholder="Rechercher…"
              />
              <IconButton type="submit" aria-label="search">
                <Search />
              </IconButton>
            </>
          )}
        </div>
        {user ? (
          <div>
            <Typography
              variant="body1"
              className={styles.Username}
              onMouseEnter={handleMenuOpen}
              onClick={handleMenuOpen}
            >
              {user?.username}
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{ onMouseLeave: handleMenuClose }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/myPage">Profil</MenuItem>
              <MenuItem onClick={hangleLogoutClick}>Déconnexion</MenuItem>
            </Menu>
          </div>
        ) : (
          <>
            <Button component={Link} to="/login">
              Se connecter
            </Button>
            <Button component={Link} to="/register">
              S'inscrire
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
