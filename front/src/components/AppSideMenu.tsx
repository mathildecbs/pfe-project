import React, { useState } from "react";
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import CollectionsIcon from "@mui/icons-material/Collections";
import PersonIcon from "@mui/icons-material/Person";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AlbumIcon from "@mui/icons-material/Album";
import styles from "../css/AppSideMenu.module.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Link } from "react-router-dom";

function AppSideMenu() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.SideMenu} ${
        isExpanded ? styles.Expanded : styles.Collapsed
      }`}
    >
      <div className={styles.MenuContent}>
        <div className={styles.ChevronButtonContainer}>
          <IconButton onClick={toggleMenu}>
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <ListItem className={styles.MenuItem} component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Accueil" />}
        </ListItem>
        <ListItem className={styles.MenuItem} component={Link} to="/community">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Communauté" />}
        </ListItem>
        <ListItem className={styles.MenuItem} component={Link} to="/explorer">
          <ListItemIcon>
            <AlbumIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Explorer" />}
        </ListItem>
        {isExpanded && (
          <ListItem
            className={styles.SubMenuItem}
            component={Link}
            to="/exploAlbums"
          >
            <ListItemIcon>
              <AutoStoriesIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Albums" />}
          </ListItem>
        )}
        <ListItem
          className={styles.MenuItem}
          component={Link}
          to="/myCollection"
        >
          <ListItemIcon>
            <LibraryMusicIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Ma collection" />}
        </ListItem>
        {isExpanded && (
          <ListItem
            className={styles.SubMenuItem}
            component={Link}
            to="/collectionAlbums"
          >
            <ListItemIcon>
              <AutoStoriesIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Albums" />}
          </ListItem>
        )}
        {isExpanded && (
          <ListItem
            className={styles.SubMenuItem}
            component={Link}
            to="/collectionPhotocards"
          >
            <ListItemIcon>
              <CollectionsIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Photocards" />}
          </ListItem>
        )}
        <ListItem className={styles.MenuItem} component={Link} to="/myPage">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Ma page" />}
        </ListItem>
      </div>
    </div>
  );
}

export default AppSideMenu;
