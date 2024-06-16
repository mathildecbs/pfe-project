import { Group } from "../types/GroupType";
import ApiUtils from "../utils/ApiUtils";
import FirebaseStorageService from "../services/FirebaseStorageService";

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

  async getSearchGroups(searchQuery: string, authToken: string): Promise<Group[]> {
    try {
      const response = await ApiUtils.getApiInstanceJson(authToken).get(
        "/group",
        {
          params: { search: searchQuery },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des groupes");
    }
  } 

  async createGroup(
    groupName: string,
    company: string,
    parent: string,
    imageFile: File | null,
    authToken: string
  ): Promise<Group> {
    try {
      const groupData: any = {
        name: groupName,
        company: company,
        parent: parent ? parent : "",
      };

      if (imageFile) {
        const filePath = `${
          process.env.REACT_APP_FIREBASE_STORAGE_DIR === undefined
            ? ""
            : process.env.REACT_APP_FIREBASE_STORAGE_DIR
        }groups/${groupName}/${groupName}`;
        const imageUrl = await FirebaseStorageService.uploadFile(
          filePath,
          imageFile
        );
        groupData.image = imageUrl;
      }

      const response = await ApiUtils.getApiInstanceJson(authToken).post(
        "/group",
        groupData
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
