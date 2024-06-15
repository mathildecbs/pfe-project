import { Artist } from "../types/ArtistType";
import ApiUtils from "../utils/ApiUtils";

class ArtistService {
  async getArtists(authToken: string): Promise<Artist[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get("/artist");
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
    authToken: string
  ): Promise<Artist> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).post("/artist", {
        name: artistName,
        birthday: birthday,
        main_group: mainGroup,
        groups: groups,
      });
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
      const response = await ApiUtils.getApiInstanceJson(authToken).patch("/artist", {
        groups: groups,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'artiste");
    }
  }
}

const artistService = new ArtistService();
export default artistService;
