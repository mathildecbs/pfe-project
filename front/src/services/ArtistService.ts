import { Artist } from "../types/ArtistType";
import ApiUtils from "../utils/ApiUtils";

class ArtistService {
  async getArtists(): Promise<Artist[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/artist");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des artistes");
    }
  }

  async getOneArtist(idArtist: string): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/artist/${idArtist}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'artiste");
    }
  }

  async createArtist(artistName: string, mainGroup?: string, groups? : string[]): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post('/artist', {
        name: artistName,
        main_group: mainGroup ? mainGroup : "",
        groups: groups
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du post artiste');
    }
  }

  async deleteArtist(idArtist: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(`/artist/${idArtist}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du delete artiste');
    }
  }

  async modifyArtist(groups : string[]): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch('/artist', {
        groups: groups
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la modification de l\'artiste');
    }
  }
}

const artistService = new ArtistService();
export default artistService;
