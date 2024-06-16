import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppCollectionAlbumDisplay.module.css";
import { Album } from "../../types/AlbumType";

interface AppCollectionAlbumDisplayProps {
  albumsToDisplay: Album[]
}

export default function AppCollectionAlbumDisplay({ albumsToDisplay }: AppCollectionAlbumDisplayProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
        {albumsToDisplay.map((albumToDisplay) => (
          <div
            key={albumToDisplay.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneAlbum/${albumToDisplay.id}`)}
          >
            <img
              src={albumToDisplay.image}
              alt={albumToDisplay.name}
              className={styles.AlbumImage}
            />
            <Typography variant="h6" className={styles.ItemText}>
              {albumToDisplay.name}
            </Typography>
          </div>
        ))}
      </div>
  );
}
