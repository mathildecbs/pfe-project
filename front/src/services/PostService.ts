import { Post } from "../types/PostType";
import { Tag } from "../types/TagType";
import { Trending } from "../types/TrendingType";
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

  async getTrendingPosts(): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/post/trending");
      const trendings = response.data as Trending;
      const posts = trendings.posts.map((trendingPost) => trendingPost.post);
      return posts;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts trending");
    }
  }  

  async getTrendingTags(): Promise<Tag[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/post/trending");
      const trendings = response.data as Trending;
      return trendings.tags;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des tags trending");
    }
  }  

  async getTrendingPostsTags(): Promise<Trending[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/post/trending");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts trending");
    }
  } 

  async getFollowingPosts(username: string): Promise<Post[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/post/following/${username}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts feed");
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
}

const postService = new PostService();
export default postService;
