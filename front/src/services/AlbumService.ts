import { Album } from "../types/AlbumType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "./FirebaseStorageService";

class AlbumService {
  async getAlbums(authToken: string): Promise<Album[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/album"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des albums");
    }
  }

  async getOneAlbum(idAlbum: string, authToken: string): Promise<Album> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/album/${idAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'album");
    }
  }

  async getSearchAlbums(searchQuery: string, authToken: string): Promise<Album[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/album",
        {
          params: { search: searchQuery },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des albums");
    }
  } 

  async createAlbum(
    albumName: string,
    releaseDate: string,
    solo: boolean,
    versions: string[],
    artist: string,
    group: string,
    imageFile: File | null,
    authToken: string
  ): Promise<Album> {
    try {
      const albumData: any = {
        name: albumName,
        release_date: releaseDate,
        solo: solo,
        versions: versions,
        artist: artist,
        group: group,
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }albums/${albumName}/${imageFile.name}`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        albumData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/album",
        albumData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post album");
    }
  }

  async deleteAlbum(idAlbum: string, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/album/${idAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete album");
    }
  }

  async modifyAlbum(groups: string[], authToken: string): Promise<Album> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        "/album",
        {
          groups: groups,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'album");
    }
  }
}

const albumService = new AlbumService();
export default albumService;
