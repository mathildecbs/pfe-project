import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Add, Remove } from "@mui/icons-material";
import albumService from "../../services/AlbumService";
import ownedAlbumService from "../../services/OwnedAlbumService";
import { Album } from "../../types/AlbumType";
import ToastUtils from "../../utils/ToastUtils";
import { useAuth } from "../../contexts/AuthProvider";
import styles from "../../css/AppExploOneAlbum.module.css";
import { OwnedInclusionAlbum } from "../../types/OwnedInclusionAlbumType";
import { OwnedAlbum } from "../../types/OwnedAlbumType";

export default function AppExploOneAlbum() {
  const { idAlbum } = useParams();
  const { user } = useAuth();
  const [thisAlbum, setThisAlbum] = useState<Album>();
  const [ownedInclusionAlbum, setOwnedInclusionAlbum] =
    useState<OwnedInclusionAlbum>();
  const [ownedVersionOfAlbum, setOwnedVersionOfAlbum] = useState<OwnedAlbum>();
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [multipleVersion, setMultipleVersion] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchAlbum();
  }, []);

  async function fetchAlbum() {
    try {
      if (idAlbum) {
        const response = await albumService.getOneAlbum(idAlbum);
        setThisAlbum(response);
        if (response.versions.length) {
          setSelectedVersion(response.versions[0]);
          setMultipleVersion(true);
        }
        fetchOwnedAlbumVersionsInclusions(response.versions[0], response);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de la récupération de l'album");
    }
  }

  async function fetchOwnedAlbumVersionsInclusions(
    actualVersion: string,
    thisCurrentAlbum?: Album
  ) {
    try {
      if (user?.username && idAlbum) {
        const response = await ownedAlbumService.getOneOwnedAlbumInclusion(
          user?.username,
          idAlbum
        );
        if (response) {
          setOwnedInclusionAlbum(response);

          if (actualVersion === undefined && thisCurrentAlbum) {
            const ownedVersion = response?.owned.find(
              (owned) => owned.album.id === thisCurrentAlbum.id
            );
            setOwnedVersionOfAlbum(ownedVersion);
          } else {
            const ownedVersion = response?.owned.find(
              (owned) => owned.version === actualVersion
            );
            setOwnedVersionOfAlbum(ownedVersion);
          }
        }
      }
    } catch (error) {
      console.log("Album non possédé");
      setOwnedInclusionAlbum(undefined);
      setOwnedVersionOfAlbum(undefined);
    }
  }

  async function handleAddToCollection() {
    try {
      if (user?.username && thisAlbum) {
        if (ownedVersionOfAlbum || (!multipleVersion && ownedInclusionAlbum)) {
          const response = await ownedAlbumService.modifyOwnedAlbum(
            user.username,
            ownedVersionOfAlbum ? ownedVersionOfAlbum?.album.id : "",
            quantity,
            selectedVersion
          );
          if (response) {
            ToastUtils.success("Quantité mise à jour avec succès !");
          }
        } else {
          const response = await ownedAlbumService.createOwnedAlbum(
            user.username,
            thisAlbum.id,
            quantity,
            selectedVersion
          );
          if (response) {
            ToastUtils.success("Album ajouté avec succès !");
          }
        }
        fetchOwnedAlbumVersionsInclusions(selectedVersion);
        setQuantity(1);
      }
    } catch (error) {
      ToastUtils.error(error, "Erreur lors de l'ajout à la collection");
    }
  }

  function handleQuantityChange(increment: boolean) {
    setQuantity((prevQuantity) =>
      increment
        ? prevQuantity + 1
        : Math.max(
            ownedVersionOfAlbum ? -ownedVersionOfAlbum.quantity + 1 : 1,
            prevQuantity - 1
          )
    );
  }

  function handleVersionChange(event: SelectChangeEvent<string>) {
    setSelectedVersion(event.target.value as string);
    const ownedVersion = ownedInclusionAlbum?.owned.find(
      (owned) => owned.version === (event.target.value as string)
    );
    setOwnedVersionOfAlbum(ownedVersion);
  }

  async function deleteOwnedAlbum() {
    try {
      if (idAlbum && user) {
        const response = await ownedAlbumService.deleteOwnedAlbum(
          user.username,
          idAlbum,
          ownedVersionOfAlbum?.version
        );
        if (response) {
          ToastUtils.success("Suppression de l'album dans votre collection");
        }
        fetchOwnedAlbumVersionsInclusions(selectedVersion);
      }
    } catch (error) {
      ToastUtils.error(
        error,
        "Erreur lors de la suppression de l'album possédé"
      );
    }
  }

  if (!thisAlbum) {
    return <CircularProgress />;
  }

  return (
    <Paper className={styles.Container}>
      <div className={styles.ImageContainer}>
        <img
          src={thisAlbum.image}
          alt={thisAlbum.name}
          className={styles.AlbumImage}
        />
      </div>
      <div className={styles.InfoContainer}>
        <Typography variant="h4" className={styles.AlbumTitle}>
          {thisAlbum.name}
        </Typography>
        <Typography variant="body1" className={styles.ReleaseDate}>
          Date de sortie: {thisAlbum.release_date}
        </Typography>
        <Typography variant="body1" className={styles.ArtistName}>
          Artiste:{" "}
          {thisAlbum.solo ? thisAlbum.artist.name : thisAlbum.group.name}
        </Typography>

        {thisAlbum.versions.length ? (
          <FormControl fullWidth className={styles.FormControl}>
            <InputLabel>Version</InputLabel>
            <Select value={selectedVersion} onChange={handleVersionChange}>
              {thisAlbum.versions.map((version) => (
                <MenuItem key={version} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          ""
        )}
        {ownedVersionOfAlbum && (
          <div className={styles.VersionOwned}>
            <CheckCircleIcon /> Version possédée (
            {ownedVersionOfAlbum?.quantity})
          </div>
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
        {ownedVersionOfAlbum && (
          <Button color="error" variant="contained" onClick={deleteOwnedAlbum}>
            Supprimer les albums possédés
          </Button>
        )}
      </div>
    </Paper>
  );
}
