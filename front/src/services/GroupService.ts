import { Group } from "../types/GroupType";
import ApiUtils from "../utils/ApiUtils";

class GroupService {
  async getGroups(authToken: string): Promise<Group[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/group"
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des groupes");
    }
  }

  async getOneGroup(idGroup: string, authToken: string): Promise<Group> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        `/group/${idGroup}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du groupe");
    }
  }

  async createGroup(
    groupName: string,
    company: string,
    parent: string,
    authToken: string
  ): Promise<Group> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/group",
        {
          name: groupName,
          company: company,
          parent: parent ? parent : "",
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la création du groupe");
    }
  }

  async deleteGroup(idGroup: string, authToken: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).delete(
        `/group/${idGroup}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la suppression du groupe");
    }
  }
}

const groupService = new GroupService();
export default groupService;
