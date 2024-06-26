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
  Box,
} from "@mui/material";
import styles from "../../css/AppTopMenu.module.css";
import { Search } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useNavigate } from "react-router-dom";

export default function AppTopMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleLogoutClick() {
    logout();
    handleMenuClose();
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  function handleSearchSubmit() {
    if (searchQuery.trim()) {
      navigate(`/exploSearch/${searchQuery.trim()}`);
      setSearchQuery("");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <IconButton type="submit" aria-label="search" onClick={handleSearchSubmit}>
                <Search />
              </IconButton>
            </>
          )}
        </div>
        {user ? (
          <div>
            <Box
              display="flex"
              alignItems="center"
              onMouseEnter={handleMenuOpen}
              onClick={handleMenuOpen}
            >
              <Typography variant="body1" className={styles.Username}>
                {user?.username}
              </Typography>
              <KeyboardArrowDownIcon />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{ onMouseLeave: handleMenuClose }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} to="/myPage/update">
                Modifier profil
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>Déconnexion</MenuItem>
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
