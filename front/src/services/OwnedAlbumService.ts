import { OwnedAlbum } from "../types/OwnedAlbumType";
import { OwnedInclusionAlbum } from "../types/OwnedInclusionAlbumType";
import ApiUtils from "../utils/ApiUtils";

class OwnedAlbumService {
  async getOwnedAlbumsInclusions(
    username: string
  ): Promise<OwnedInclusionAlbum[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}/album`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des albums");
    }
  }

  async getOneOwnedAlbumInlusion(
    username: string,
    idOwnedAlbum: string
  ): Promise<OwnedInclusionAlbum> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}/album/${idOwnedAlbum}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'album");
    }
  }

  async createOwnedAlbum(
    username: string,
    albumId: string,
    quantity: number,
    version: string
  ): Promise<OwnedAlbum[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post(
        `/user/${username}/album`,
        {
          album: albumId,
          quantity: quantity,
          version: version,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post album possédé");
    }
  }

  async deleteOwnedAlbum(
    username: string,
    idAlbum: string,
    version: string | undefined
  ): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(
        `/user/${username}/album/${idAlbum}`,
        {
          data: {
            version: version,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete album");
    }
  }

  async modifyOwnedAlbum(
    username: string,
    idOwnedAlbum: string,
    quantity: number,
    version: string
  ): Promise<OwnedAlbum> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch(
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
