import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppCollectionInclusionDisplay.module.css";
import { Inclusion } from "../../types/InclusionType";

interface AppCollectionInclusionDisplayProps {
  inclusionsToDisplay: Inclusion[];
}

export default function AppCollectionInclusionDisplay({
  inclusionsToDisplay,
}: AppCollectionInclusionDisplayProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
      {inclusionsToDisplay.map((inclusionToDisplay) => (
        <div
          key={inclusionToDisplay.id}
          className={styles.ItemCard}
          onClick={() =>
            navigate(`/exploOneInclusion/${inclusionToDisplay.id}`)
          }
        >
          <img
            src={inclusionToDisplay.image}
            alt={inclusionToDisplay.name}
            className={styles.InclusionImage}
          />
          <Typography variant="body1" className={styles.ItemText}>
            {inclusionToDisplay.name}
          </Typography>
          <Typography variant="body1" className={styles.ItemText}>
            {inclusionToDisplay.member.name}
          </Typography>
          <Typography variant="body2" className={styles.ItemText}>
            {inclusionToDisplay.album.name}
          </Typography>
        </div>
      ))}
    </div>
  );
}
