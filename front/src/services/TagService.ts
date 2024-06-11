import { Tag } from "../types/TagType";
import ApiUtils from "../utils/ApiUtils";

class TagService {
  async getTags(): Promise<Tag[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/tag");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des tages");
    }
  }

  async getOneTag(idTag: string): Promise<Tag> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/tag/${idTag}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du post");
    }
  }

  async createTag(tagName: string, company: string, parent? : string): Promise<Tag> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post('/tag', {
        name: tagName,
        parent: parent ? parent : "",
        company: company
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du post tag');
    }
  }

  async deleteTag(idTag: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(`/tag/${idTag}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du delete tag');
    }
  }
}

const tagService = new TagService();
export default tagService;
