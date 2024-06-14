import { Group } from "../types/GroupType";
import ApiUtils from "../utils/ApiUtils";

class GroupService {
  async getGroups(): Promise<Group[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get("/group");
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des groupes");
    }
  }

  async getOneGroup(idGroup: string): Promise<Group> {
    try {
      const response = await ApiUtils.getApiInstanceJson().get(`/group/${idGroup}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération du post");
    }
  }

  async createGroup(groupName: string, company: string, parent? : string): Promise<Group> {
    try {
      const response = await ApiUtils.getApiInstanceJson().post('/group', {
        name: groupName,
        company: company,
        parent: parent ? parent : ""
      });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du post group');
    }
  }

  async deleteGroup(idGroup: string): Promise<boolean> {
    try {
      const response = await ApiUtils.getApiInstanceJson().delete(`/group/${idGroup}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du delete group');
    }
  }
}

const groupService = new GroupService();
export default groupService;
