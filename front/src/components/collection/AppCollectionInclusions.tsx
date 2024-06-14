import { useEffect, useState } from "react";
import ToastUtils from "../../utils/ToastUtils";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AppCollectionInclusions.module.css";
import { OwnedInclusion } from "../../types/OwnedInclusionType";
import ownedInclusionService from "../../services/OwnedInclusionService";
import { useAuth } from "../../contexts/AuthProvider";

export default function AppCollectionInclusions() {
  const [ownedInclusions, setOwnedInclusions] = useState<OwnedInclusion[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnedInclusions();
  }, []);

  async function fetchOwnedInclusions() {
    try {
      if (user) {
        const response = await ownedInclusionService.getOwnedInclusions(user.username);
        setOwnedInclusions(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération des inclusions");
    }
  }

  function renderInclusions() {
    return (
      <div className={styles.Container}>
        {ownedInclusions.map((ownedInclusion) => (
          <div
            key={ownedInclusion.id}
            className={styles.ItemCard}
            onClick={() => navigate(`/exploOneInclusion/${ownedInclusion.inclusion.id}`)}
          >
            <img
              src={ownedInclusion.inclusion.image}
              alt={ownedInclusion.inclusion.name}
              className={styles.InclusionImage}
            />
            <Typography variant="h6" className={styles.ItemText}>
              {ownedInclusion.inclusion.name}
            </Typography>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Paper className={styles.Section}>
      <Typography variant="h4">Inclusions possédés</Typography>
      {renderInclusions()}
    </Paper>
  );
}
