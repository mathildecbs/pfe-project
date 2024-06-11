import React from "react";
import styles from "../css/AppPostIconButton.module.css";
import { IconButton } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

export default function AppPostIconButton() {
  return (
    <div className={styles.PostIconContainer}>
      <IconButton className={styles.PostIcon}>
        <DriveFileRenameOutlineIcon />
      </IconButton>
    </div>
  );
}
