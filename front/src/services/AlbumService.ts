import { Album } from "../types/AlbumType";
import ApiUtils from "../utils/ApiUtils";

class AlbumService {
  async getAlbums(): Promise<Album[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/album");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des albums");
    }
  }

  async getOneAlbum(idAlbum: string): Promise<Album> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/album/${idAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'album");
    }
  }

  async createAlbum(
    albumName: string,
    releaseDate: string,
    solo: boolean,
    versions: string[],
    artist: string,
    group: string
  ): Promise<Album> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/album", {
        name: albumName,
        release_date: releaseDate,
        solo: solo,
        version: versions,
        artist: artist,
        group: group,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post album");
    }
  }

  async deleteAlbum(idAlbum: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(
        `/album/${idAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete album  ");
    }
  }

  async modifyAlbum(groups: string[]): Promise<Album> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch("/album", {
        groups: groups,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'album");
    }
  }
}

const albumService = new AlbumService();
export default albumService;
