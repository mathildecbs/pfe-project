import { storage } from "../index";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default class FirebaseStorageUtils {
  static async uploadFile(filePath: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      throw new Error("Error uploading file: " + error);
    }
  }

  static async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      throw new Error("Error deleting file: " + error);
    }
  }

  static async getFileDownloadURL(filePath: string): Promise<string> {
    try {
      const fileRef = ref(storage, filePath);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      throw new Error("Error getting file download URL: " + error);
    }
  }
}
