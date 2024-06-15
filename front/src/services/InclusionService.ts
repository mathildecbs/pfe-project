import { Inclusion } from "../types/InclusionType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "./FirebaseStorageService";

class InclusionService {
  async getInclusions(authToken: string): Promise<Inclusion[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/inclusion"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des inclusions");
    }
  }

  async getOneInclusion(
    idInclusion: string,
    authToken: string
  ): Promise<Inclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/inclusion/${idInclusion}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'inclusion");
    }
  }

  async createInclusion(
    inclusionName: string,
    albumId: string,
    memberId: string,
    type: string,
    imageFile: File | null,
    authToken: string
  ): Promise<Inclusion> {
    try {
      const inclusionData: any = {
        name: inclusionName,
        album: albumId,
        member: memberId,
        type: type,
      };

      if (imageFile) {
        const filePath = `inclusions/${inclusionName}/${imageFile.name}`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        inclusionData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/inclusion",
        inclusionData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'inclusion");
    }
  }

  async deleteInclusion(
    idInclusion: string,
    authToken: string
  ): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/inclusion/${idInclusion}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la suppression de l'inclusion");
    }
  }

  async modifyInclusion(
    inclusionName: string,
    albumId: string,
    memberId: string,
    type: string,
    authToken: string
  ): Promise<Inclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        "/inclusion",
        {
          name: inclusionName,
          album: albumId,
          member: memberId,
          type: type,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'inclusion");
    }
  }
}

const inclusionService = new InclusionService();
export default inclusionService;
