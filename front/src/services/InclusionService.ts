import { Inclusion } from "../types/InclusionType";
import ApiUtils from "../utils/ApiUtils";

class InclusionService {
  async getInclusions(): Promise<Inclusion[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/inclusion");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des inclusions");
    }
  }

  async getOneInclusion(idInclusion: string): Promise<Inclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/inclusion/${idInclusion}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'inclusion");
    }
  }

  async createInclusion(inclusionName: string, albumId: string, memberId: string, type: string): Promise<Inclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post('/inclusion', {
        name: inclusionName,
        album: albumId,
        member: memberId,
        type: type
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du post inclusion');
    }
  }

  async deleteInclusion(idInclusion: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(`/inclusion/${idInclusion}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du delete inclusion  ');
    }
  }

  async modifyInclusion(inclusionName: string, albumId: string, memberId: string, type: string): Promise<Inclusion> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch('/inclusion', {
        name: inclusionName,
        album: albumId,
        member: memberId,
        type: type
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la modification de l\'inclusion');
    }
  }
}

const inclusionService = new InclusionService();
export default inclusionService;
