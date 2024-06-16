import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import ownedInclusionService from "../../services/OwnedInclusionService";
import { Inclusion } from "../../types/InclusionType";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import styles from "../../css/AppExploOneInclusion.module.css";
import { OwnedInclusion } from "../../types/OwnedInclusionType";
import inclusionService from "../../services/InclusionService";

export default function AppExploOneInclusion() {
  const { idInclusion } = useParams();
  const { user, authToken } = useAuth();
  const [thisInclusion, setThisInclusion] = useState<Inclusion>();
  const [quantity, setQuantity] = useState<number>(1);
  const [ownInclusion, setOwnInclusion] = useState<OwnedInclusion | undefined>(
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchInclusion();
    fetchOwnInclusions();
  }, []);

  async function fetchInclusion() {
    try {
      if (idInclusion && authToken) {
        const response = await inclusionService.getOneInclusion(
          idInclusion,
          authToken
        );
        setThisInclusion(response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération de l'inclusion");
    }
  }

  async function fetchOwnInclusions() {
    try {
      if (user && authToken) {
        const ownedInclusions = await ownedInclusionService.getOwnedInclusions(
          user.username,
          authToken
        );

        const owned = ownedInclusions.find(
          (ownedInclusion) =>
            ownedInclusion.inclusion.id.toString() === idInclusion
        );
        setOwnInclusion(owned);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération de l'inclusion");
    }
  }

  async function handleAddToCollection() {
    try {
      if (user?.username && thisInclusion && authToken) {
        if (ownInclusion) {
          const response = await ownedInclusionService.modifyOwnedInclusion(
            user.username,
            ownInclusion.inclusion.id,
            quantity,
            authToken
          );
          if (response) {
            ToastUtils.success("Quantité mise à jour avec succès !");
          }
        } else {
          const response = await ownedInclusionService.createOwnedInclusion(
            user.username,
            thisInclusion.id,
            quantity,
            authToken
          );
          if (response) {
            ToastUtils.success("Inclusion ajoutée avec succès !");
          }
        }
        fetchOwnInclusions();
        setQuantity(1);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de l'ajout à la collection");
    }
  }

  async function deleteOwnedInclusion() {
    try {
      if (idInclusion && user && authToken) {
        const response = await ownedInclusionService.deleteOwnedInclusion(
          user.username,
          idInclusion,
          authToken
        );
        if (response) {
          ToastUtils.success(
            "Suppression de l'inclusion dans votre collection"
          );
        }
        fetchOwnInclusions();
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la suppression de l'inclusion possédée"
      );
    }
  }

  async function deleteInclusion() {
    try {
      if (idInclusion && authToken) {
        const response = await inclusionService.deleteInclusion(idInclusion, authToken);
        if (response) {
          ToastUtils.success("Suppression de l'inclusions");
          navigate(`/exploGroups`);
        }
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la suppression de l'inclusion");
    }
  }

  function handleQuantityChange(increment: boolean) {
    setQuantity((prevQuantity) =>
      increment
        ? prevQuantity + 1
        : Math.max(
            ownInclusion ? -ownInclusion.quantity + 1 : 1,
            prevQuantity - 1
          )
    );
  }

  if (!thisInclusion) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.Container}>
      <div className={styles.ImageContainer}>
        <img
          src={thisInclusion.image}
          alt={thisInclusion.name}
          className={styles.InclusionImage}
        />
      </div>
      <div className={styles.InfoContainer}>
        <Typography variant="h4" className={styles.InclusionTitle}>
          {thisInclusion.name}
        </Typography>
        <Typography variant="body1" className={styles.ReleaseDate}>
          Album: {thisInclusion.album.name}
        </Typography>
        <Typography variant="body1" className={styles.ArtistName}>
          Artiste: {thisInclusion.member.name}
        </Typography>
        {ownInclusion && (
          <Typography variant="body1" className={styles.OwnedQuantity}>
            Quantité possédée: {ownInclusion.quantity}
          </Typography>
        )}
        <div className={styles.QuantityContainer}>
          <IconButton
            onClick={() => handleQuantityChange(false)}
            aria-label="reduce quantity"
          >
            <Remove />
          </IconButton>
          <Typography variant="body1" className={styles.QuantityText}>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => handleQuantityChange(true)}
            aria-label="increase quantity"
          >
            <Add />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCollection}
          >
            {quantity < 1 ? "Retirer" : "Ajouter"} à ma collection
          </Button>
        </div>
        {ownInclusion && (
          <Button
            color="error"
            variant="contained"
            onClick={deleteOwnedInclusion}
          >
            Supprimer les inclusions possédés
          </Button>
        )}
      </div>
      {user?.isAdmin && (
          <Button color="error" variant="contained" onClick={deleteInclusion}>
            Supprimer l'inclusion définitivement
          </Button>
        )}
    </Paper>
  );
}
