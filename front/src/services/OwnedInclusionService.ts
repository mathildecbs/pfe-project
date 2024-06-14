import { OwnedInclusion } from "../types/OwnedInclusionType";
import { OwnedInclusionAlbum } from "../types/OwnedInclusionAlbumType";
import ApiUtils from "../utils/ApiUtils";

class OwnedInclusionService {
  async getOwnedInclusions(username: string): Promise<OwnedInclusion[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}/inclusion`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des inclusions");
    }
  }

  async getOneOwnedInclusion(
    username: string,
    idOwnedInclusion: string
  ): Promise<OwnedInclusionAlbum> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}/inclusion/${idOwnedInclusion}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'inclusion");
    }
  }

  async createOwnedInclusion(
    username: string,
    inclusionId: string,
    quantity: number
  ): Promise<OwnedInclusion[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post(
        `/user/${username}/inclusion`,
        {
          inclusion: inclusionId,
          quantity: quantity,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post inclusion possédé");
    }
  }

  async deleteOwnedInclusion(
    username: string,
    idInclusion: string
  ): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(
        `/user/${username}/inclusion/${idInclusion}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete inclusion");
    }
  }

  async modifyOwnedInclusion(
    username: string,
    idOwnedInclusion: string,
    quantity: number
  ): Promise<OwnedInclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch(
        `/user/${username}/inclusion/${idOwnedInclusion}`,
        {
          quantity: quantity,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'inclusion possédé");
    }
  }
}

const ownedInclusionService = new OwnedInclusionService();
export default ownedInclusionService;
