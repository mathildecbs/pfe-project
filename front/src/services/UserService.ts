import { User } from "../types/UserType";
import ApiUtils from "../utils/ApiUtils";

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/user");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des posts");
    }
  }

  async getOneUser(username: string): Promise<User> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(
        `/user/${username}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du post");
    }
  }
}

const userService = new UserService();
export default userService;
