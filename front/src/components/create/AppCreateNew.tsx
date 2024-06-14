import {
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../../css/AppCreateNew.module.css";
import { useState } from "react";
import AppCreateArtist from "./AppCreateArtist";
import AppCreateGroup from "./AppCreateGroup";
import AppCreateInclusion from "./AppCreateInclusion";
import AppCreateAlbum from "./AppCreateAlbum";

export default function AppCreateNew() {
  const [selectedCreationType, setSelectedCreationType] = useState("un groupe");
  const creationTypes = ["un groupe", "un artiste", "un album", "une inclusion"];

  function handleCreationTypeSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedType = event.target.value;
    if (selectedType) {
      setSelectedCreationType(selectedType);
    }
  }

  function renderCreationComponent() {
    switch (selectedCreationType) {
      case "un groupe":
        return <AppCreateGroup />;
      case "un artiste":
        return <AppCreateArtist />;
      case "un album":
        return <AppCreateAlbum />;
      case "une inclusion":
        return <AppCreateInclusion />;
      default:
        return null;
    }
  }

  return (
    <Paper className={styles.CreateNewContainer}>
      <Typography variant="h4">Création d'éléments</Typography>
      <TextField
        className={styles.languageSelect}
        id="select-create"
        select
        label="Créer..."
        value={selectedCreationType}
        onChange={handleCreationTypeSelect}
        variant="outlined"
        margin="normal"
      >
        {creationTypes.map((type, index) => (
          <MenuItem key={index} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      {renderCreationComponent()}
    </Paper>
  );
}
