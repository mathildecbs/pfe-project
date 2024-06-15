import { TokenUser } from "../types/TokenUserType";
import { User } from "../types/UserType";
import ApiUtils from "../utils/ApiUtils";

class UserService {
  async getUsers(authToken: string): Promise<User[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get("/user");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }
  }

  async getOneUser(username: string): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  }

  async createUser(username: string, hashedPassword: string, name: string, description: string | null): Promise<TokenUser> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/user", {
        username: username,
        password: hashedPassword,
        name: name,
        description: description,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  }

  async loginUser(username: string, hashedPassword: string): Promise<TokenUser> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post("/user/login", {
        username: username,
        password: hashedPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la connexion de l'utilisateur");
    }
  }

  async followUser(username1: string, username2: string, authToken: string): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(`/user/${username1}/follow/${username2}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du suivi de l'utilisateur");
    }
  }

  async unfollowUser(username1: string, username2: string, authToken: string): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(`/user/${username1}/unfollow/${username2}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du désabonnement de l'utilisateur");
    }
  }
}

const userService = new UserService();
export default userService;
