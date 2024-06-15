import FirebaseStorageUtils from "../utils/FirebaseStorageUtils";

class FirebaseStorageService {
  static async uploadFile(filePath: string, file: File): Promise<string> {
    try {
      const downloadURL = await FirebaseStorageUtils.uploadFile(filePath, file);
      return downloadURL;
    } catch (error) {
      throw new Error("Error uploading file: " + error);
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      await FirebaseStorageUtils.deleteFile(filePath);
    } catch (error) {
      throw new Error("Error deleting file: " + error);
    }
  }

  static async getFileDownloadURL(filePath: string): Promise<string> {
    try {
      const downloadURL = await FirebaseStorageUtils.getFileDownloadURL(
        filePath
      );
      return downloadURL;
    } catch (error) {
      throw new Error("Error getting file download URL: " + error);
    }
  }
}

export default FirebaseStorageService;
