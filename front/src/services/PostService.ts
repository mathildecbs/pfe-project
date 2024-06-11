import { Post } from "../types/PostType";
import { User } from "../types/UserType";
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

  async publishPost(user: User, postContent: string, parent? : number): Promise<Post> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post('/post', {
        user: user?.username,
        parent: parent ? parent : "",
        tags: [],
        content: postContent
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du post');
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

  async getFeed(username: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/post/feed/${username}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

}

const postService = new PostService();
export default postService;