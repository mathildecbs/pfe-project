import { Artist } from "../types/ArtistType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "./FirebaseStorageService";

class ArtistService {
  async getArtists(authToken: string): Promise<Artist[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/artist"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des artistes");
    }
  }

  async getSoloArtists(authToken: string): Promise<Artist[]> {
    try {
      const artists = await this.getArtists(authToken);
      const soloArtists = artists.filter(
        (artist) => artist.main_group === null
      );
      return soloArtists;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des artistes");
    }
  }

  async getOneArtist(idArtist: string, authToken: string): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/artist/${idArtist}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'artiste");
    }
  }

  async createArtist(
    artistName: string,
    birthday: string,
    mainGroup: string | null,
    groups: string[],
    imageFile: File | null,
    authToken: string
  ): Promise<Artist> {
    try {
      const artistData: any = {
        name: artistName,
        birthday: birthday,
        main_group: mainGroup,
        groups: groups,
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }artists/${artistName}/${imageFile.name}`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        artistData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/artist",
        artistData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post artiste");
    }
  }

  async deleteArtist(idArtist: string, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/artist/${idArtist}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete artiste");
    }
  }

  async modifyArtist(groups: string[], authToken: string): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        "/artist",
        {
          groups: groups,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'artiste");
    }
  }
}

const artistService = new ArtistService();
export default artistService;
