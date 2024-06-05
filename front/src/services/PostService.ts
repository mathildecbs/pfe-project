import { Post } from "../types/PostType";
import ApiUtils from "../utils/ApiUtils";

class PostService {
  async getPosts(): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/post");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async getOnePost(idPost: string): Promise<Post> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/post/${idPost}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du post");
    }
  }

  async actionPost(postId: number, username: string | undefined, actionType: string): Promise<Post> {
    try {
      const response = await ApiUtils.getApiInstanceJson().patch(`/post/${postId}/${actionType}/${username}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }
}

const postService = new PostService();
export default postService;
