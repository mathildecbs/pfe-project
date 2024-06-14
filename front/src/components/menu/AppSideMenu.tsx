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
import GroupsIcon from '@mui/icons-material/Groups';
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AddBoxIcon from '@mui/icons-material/AddBox';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import styles from "../../css/AppSideMenu.module.css";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

function AppSideMenu() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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
        <ListItem
          className={`${styles.MenuItem} ${isActive("/") ? styles.ActiveMenuItem : ""}`}
          component={Link}
          to="/"
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Accueil" />}
        </ListItem>
        <ListItem
          className={`${styles.MenuItem} ${isActive("/community") ? styles.ActiveMenuItem : ""}`}
          component={Link}
          to="/community"
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Communauté" />}
        </ListItem>
        <ListItem
          className={`${styles.MenuItem} ${isActive("/explorer") ? styles.ActiveMenuItem : ""}`}
          component={Link}
          to="/explorer"
        >
          <ListItemIcon>
            <TravelExploreIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Explorer" />}
        </ListItem>
        {isExpanded && (
          <>
            <ListItem
              className={`${styles.SubMenuItem} ${isActive("/exploArtists") ? styles.ActiveMenuItem : ""}`}
              component={Link}
              to="/exploArtists"
            >
              <ListItemIcon>
                <GroupsIcon />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Artists" />}
            </ListItem>
            <ListItem
              className={`${styles.SubMenuItem} ${isActive("/exploGroups") ? styles.ActiveMenuItem : ""}`}
              component={Link}
              to="/exploGroups"
            >
              <ListItemIcon>
                <Diversity3Icon />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Groupes" />}
            </ListItem>
            <ListItem
              className={`${styles.SubMenuItem} ${isActive("/exploAlbums") ? styles.ActiveMenuItem : ""}`}
              component={Link}
              to="/exploAlbums"
            >
              <ListItemIcon>
                <AutoStoriesIcon />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Albums" />}
            </ListItem>
          </>
        )}
        <ListItem
          className={`${styles.MenuItem} ${isActive("/myCollection") ? styles.ActiveMenuItem : ""}`}
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
            className={`${styles.SubMenuItem} ${isActive("/collectionAlbums") ? styles.ActiveMenuItem : ""}`}
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
            className={`${styles.SubMenuItem} ${isActive("/collectionInclusions") ? styles.ActiveMenuItem : ""}`}
            component={Link}
            to="/collectionInclusions"
          >
            <ListItemIcon>
              <CollectionsIcon />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Inclusions" />}
          </ListItem>
        )}
        <ListItem
          className={`${styles.MenuItem} ${isActive("/myPage") ? styles.ActiveMenuItem : ""}`}
          component={Link}
          to="/myPage"
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Ma page" />}
        </ListItem>
        <ListItem
          className={`${styles.MenuItem} ${isActive("/createNew") ? styles.ActiveMenuItem : ""}`}
          component={Link}
          to="/createNew"
        >
          <ListItemIcon>
            <AddBoxIcon />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Créer" />}
        </ListItem>
      </div>
    </div>
  );
}

export default AppSideMenu;
