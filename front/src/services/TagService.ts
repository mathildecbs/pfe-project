import { Post } from "../types/PostType";
import { Tag } from "../types/TagType";
import ApiUtils from "../utils/ApiUtils";

class TagService {
  async getTags(authToken: string): Promise<Tag[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get("/tag");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des tags");
    }
  }

  async getOneTagPosts(tagName: string, authToken: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/tag/${tagName}`
      );
      return response.data.posts;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async createTag(tagName: string, authToken: string): Promise<Tag> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).post("/tag", {
        name: tagName,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post tag");
    }
  }

  async deleteTag(idTag: string, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/tag/${idTag}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du delete tag");
    }
  }
}

const tagService = new TagService();
export default tagService;
