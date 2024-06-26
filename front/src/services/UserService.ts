import { TokenUser } from "../types/TokenUserType";
import { User } from "../types/UserType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "./FirebaseStorageService";

class UserService {
  async getUsers(authToken: string): Promise<User[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/user"
      );
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

  async getSearchUsers(
    searchQuery: string,
    authToken: string
  ): Promise<User[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/user",
        {
          params: { search: searchQuery },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des users");
    }
  }

  async createUser(
    username: string,
    hashedPassword: string,
    name: string,
    description: string | null,
    imageFile: File | null
  ): Promise<TokenUser> {
    try {
      const userData: any = {
        username: username,
        password: hashedPassword,
        name: name,
        description: description,
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }user/${username}/user`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        userData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson().post(
        "/user",
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  }

  async loginUser(
    username: string,
    hashedPassword: string
  ): Promise<TokenUser> {
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

  async followUser(
    username1: string,
    username2: string,
    authToken: string
  ): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `/user/${username1}/follow/${username2}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du suivi de l'utilisateur");
    }
  }

  async unfollowUser(
    username1: string,
    username2: string,
    authToken: string
  ): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `/user/${username1}/unfollow/${username2}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du désabonnement de l'utilisateur");
    }
  }

  async updateUser(
    username: string,
    name: string,
    description: string | null,
    imageFile: File | null,
    authToken: string
  ): Promise<User> {
    try {
      const userData: any = {
        name: name,
        description: description,
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }user/${username}/user`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        userData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `user/${username}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la modification de l'utilisateur");
    }
  }

  async updatePassword(
    username: string,
    password: string,
    authToken: string
  ): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `user/${username}`,
        { password: password }
      );
      return response.data;
    } catch {
      throw new Error("Erreur lors de la modification du mot de passe");
    }
  }

  async toAdmin(username: string, authToken: string): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).patch(
        `user/admin/${username}`,
        { isAdmin: true }
      );
      return response.data;
    } catch {
      throw new Error("Erreur lors de la modification du mot de passe");
    }
  }

  async deleteUser(username: string, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `user/${username}`
      );
      return response.data;
    } catch {
      throw new Error("Erreur lors de la modification du mot de passe");
    }
  }
}

const userService = new UserService();
export default userService;
