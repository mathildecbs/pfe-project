import { Post } from "../types/PostType";
import { Tag } from "../types/TagType";
import ApiUtils from "../utils/ApiUtils";

class TagService {
  async getTags(): Promise<Tag[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/tag");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des tags");
    }
  }

  async getOneTagPosts(tagName: string): Promise<Post[]> {
    try {
      // incomplete posts
      const response = await ApiUtils.getApiInstanceJson().get(
        `/tag/${tagName}`
      );
      return response.data.posts;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async createTag(tagName: string): Promise<Tag> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/tag", {
        name: tagName,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post tag");
    }
  }

  async deleteTag(idTag: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(
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
