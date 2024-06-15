import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import ownedInclusionService from "../../services/OwnedInclusionService";
import { Inclusion } from "../../types/InclusionType";

export default function AppExploOneAlbum() {
  const { idAlbum } = useParams();
  const { user, authToken } = useAuth();
  const [thisAlbum, setThisAlbum] = useState<Album>();
  const [ownedInclusionAlbum, setOwnedInclusionAlbum] =
    useState<OwnedInclusionAlbum>();
  const [ownedVersionOfAlbum, setOwnedVersionOfAlbum] = useState<OwnedAlbum>();
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [multipleVersion, setMultipleVersion] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbum();
  }, []);

  async function fetchAlbum() {
    try {
      if (idAlbum && authToken) {
        const response = await albumService.getOneAlbum(idAlbum, authToken);
        setThisAlbum(response);
        if (response.versions) {
          setSelectedVersion(response.versions[0]);
          setMultipleVersion(true);
          fetchOwnedAlbumVersionsInclusions(response.versions[0], response);
        } else {
          fetchOwnedAlbumVersionsInclusions("", response);
        }
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
      if (user?.username && idAlbum && authToken) {
        const response = await ownedAlbumService.getOneOwnedAlbumInclusion(
          user?.username,
          idAlbum,
          authToken
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
      setOwnedInclusionAlbum(undefined);
      setOwnedVersionOfAlbum(undefined);
      console.log("Album non possédé");
    }
  }

  async function handleAddToCollection() {
    try {
      if (user?.username && thisAlbum && authToken) {
        if (ownedVersionOfAlbum || (!multipleVersion && ownedInclusionAlbum)) {
          const response = await ownedAlbumService.modifyOwnedAlbum(
            user.username,
            ownedVersionOfAlbum ? ownedVersionOfAlbum?.album.id : "",
            quantity,
            selectedVersion,
            authToken
          );
          if (response) {
            ToastUtils.success("Quantité mise à jour avec succès !");
          }
        } else {
          const response = await ownedAlbumService.createOwnedAlbum(
            user.username,
            thisAlbum.id,
            quantity,
            selectedVersion,
            authToken
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

  async function deleteOwnedAlbum() {
    try {
      if (idAlbum && user && authToken) {
        const response = await ownedAlbumService.deleteOwnedAlbum(
          user.username,
          idAlbum,
          ownedVersionOfAlbum?.version,
          authToken
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

  async function handleAddInclusionToCollection(inclusionId: string) {
    try {
      if (user && authToken) {
        const response = await ownedInclusionService.createOwnedInclusion(
          user.username,
          inclusionId,
          1,
          authToken
        );
        if (response) {
          ToastUtils.success("Inclusion ajoutée avec succès !");
        }
      }
      fetchOwnedAlbumVersionsInclusions(selectedVersion);
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

  function checkIfOwnedInclusion(inclusionId: string) {
    if (ownedInclusionAlbum && ownedInclusionAlbum.inclusions) {
      if (inclusionId) {
        const ownedInclusion = ownedInclusionAlbum.inclusions.find(
          (ownedInclusion) => ownedInclusion.inclusion.id === inclusionId
        );

        if (ownedInclusion) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
  }

  function navigateTo(root: string, specification: string) {
    navigate(`/${root}/${specification}`);
  }

  function groupInclusionsByMember(inclusions: any[]) {
    return inclusions.reduce((acc, inclusion) => {
      const memberName = inclusion.member.name;
      if (!acc[memberName]) {
        acc[memberName] = [];
      }
      acc[memberName].push(inclusion);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  if (!thisAlbum) {
    return <CircularProgress />;
  }

  const groupedInclusions = groupInclusionsByMember(thisAlbum.inclusions);

  return (
    <Paper className={styles.Container}>
      <div className={styles.AlbumContainer}>
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

          {thisAlbum.versions ? (
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
            <div className={styles.Owned}>
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
            <Button
              color="error"
              variant="contained"
              onClick={deleteOwnedAlbum}
            >
              Supprimer les albums possédés
            </Button>
          )}
        </div>
      </div>
      <div>
        {Object.keys(groupedInclusions).length > 0 && (
          <div className={styles.InclusionsContainer}>
            <Typography variant="h5">Inclusions</Typography>
            {Object.keys(groupedInclusions).map((memberName) => (
              <div key={memberName} className={styles.MemberGroup}>
                <Typography variant="h6">{memberName}</Typography>
                <div className={styles.InclusionsGrid}>
                  {groupedInclusions[memberName].map((inclusion: Inclusion) => (
                    <div
                      key={inclusion.id}
                      className={styles.InclusionContainer}
                    >
                      <img
                        src={inclusion.image}
                        alt={inclusion.name}
                        onClick={() =>
                          navigateTo(
                            "exploOneInclusion",
                            inclusion.id.toString()
                          )
                        }
                      />
                      <div className={styles.InclusionItem}>
                        <Typography variant="body1">
                          {inclusion.name}
                        </Typography>
                        <Typography variant="body2">
                          Type: {inclusion.type}
                        </Typography>
                        {checkIfOwnedInclusion(inclusion.id) ? (
                          <Typography variant="body2" className={styles.Owned}>
                            <CheckCircleIcon /> Possédée
                          </Typography>
                        ) : (
                          <Button
                            onClick={() =>
                              handleAddInclusionToCollection(inclusion.id)
                            }
                          >
                            Ajouter à la collection
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Paper>
  );
}
