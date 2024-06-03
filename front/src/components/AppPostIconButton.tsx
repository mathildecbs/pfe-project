import { useState } from "react";
import styles from "../css/AppPostIconButton.module.css";
import { IconButton } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AppPostDialog from "./AppPostDialog";

export default function AppPostIconButton() {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <div className={styles.PostIconContainer}>
      <IconButton className={styles.PostIcon} onClick={handleOpen}>
        <DriveFileRenameOutlineIcon />
      </IconButton>
      <AppPostDialog isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
