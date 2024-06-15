import { OwnedAlbum } from "../types/OwnedAlbumType";
import { OwnedInclusionAlbum } from "../types/OwnedInclusionAlbumType";
import ApiUtils from "../utils/ApiUtils";

class OwnedAlbumService {
  async getOwnedAlbums(username: string, authToken: string): Promise<OwnedAlbum[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/user/${username}/album`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des albums");
    }
  }

  async getOneOwnedAlbumInclusion(username: string, idOwnedAlbum: string, authToken: string): Promise<OwnedInclusionAlbum> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/user/${username}/album/${idOwnedAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'album");
    }
  }

  async createOwnedAlbum(username: string, albumId: string, quantity: number, version: string, authToken: string): Promise<OwnedAlbum[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        `/user/${username}/album`,
        {
          album: albumId,
          quantity: quantity,
          version: version,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'album possédé");
    }
  }

  async deleteOwnedAlbum(username: string, idAlbum: string, version: string | undefined, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/user/${username}/album/${idAlbum}`,
        {
          data: {
            version: version,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'album");
    }
  }

  async modifyOwnedAlbum(username: string, idOwnedAlbum: string, quantity: number, version: string, authToken: string): Promise<OwnedAlbum> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `/user/${username}/album/${idOwnedAlbum}`,
        {
          quantity: quantity,
          version: version,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'album possédé");
    }
  }
}

const ownedAlbumService = new OwnedAlbumService();
export default ownedAlbumService;
