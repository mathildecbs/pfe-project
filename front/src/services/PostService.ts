import { Post } from "../types/PostType";
import { Tag } from "../types/TagType";
import { Trending } from "../types/TrendingType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "./FirebaseStorageService";

class PostService {
  async getPosts(authToken: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/post"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async getOnePost(idPost: string, authToken: string): Promise<Post> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/post/${idPost}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du post");
    }
  }

  async getTrendingPosts(authToken: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/post/trending"
      );
      const trendings = response.data as Trending;
      const posts = trendings.posts.map((trendingPost) => trendingPost.post);
      return posts;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts trending");
    }
  }

  async getTrendingTags(authToken: string): Promise<Tag[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/post/trending"
      );
      const trendings = response.data as Trending;
      return trendings.tags;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des tags trending");
    }
  }

  async getTrendingPostsTags(authToken: string): Promise<Trending[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/post/trending"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts trending");
    }
  }

  async getFollowingPosts(
    username: string,
    authToken: string
  ): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/post/following/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts feed");
    }
  }

  async getFeed(username: string, authToken: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/post/feed/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async getOneTagPosts(tagName: string, authToken: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/post/tag/${tagName}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async publishPost(
    username: string,
    postContent: string,
    tags: string[],
    imageFile: File | null,
    authToken: string,
    parent?: number
  ): Promise<Post> {
    try {
      const postData: any = {
        user: username,
        tags: tags,
        content: postContent,
        parent: parent ? parent : "",
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }posts/${username}/${imageFile.name}`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        postData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/post",
        postData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du post");
    }
  }

  async actionPost(
    postId: number,
    username: string | undefined,
    actionType: string,
    authToken: string
  ): Promise<Post> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `/post/${postId}/${actionType}/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }
}

const postService = new PostService();
export default postService;
