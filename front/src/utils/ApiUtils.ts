import axios, { AxiosInstance, AxiosError } from "axios";
import { hashPassword } from "./HashUtils";

interface LoginRequestBody {
  username: string;
  hashPassword: string;
}

export default abstract class ApiUtils {
  private static readonly API_BASE_URL = "https://kollection-blue.vercel.app/";
  private static readonly API_INSTANCE_JSON = axios.create({
    baseURL: ApiUtils.API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  static getApiInstanceJson(authToken?: string): AxiosInstance {
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return axios.create({
      baseURL: ApiUtils.API_BASE_URL,
      headers: headers,
    });
  }

  static async authentification(username: string, password: string, login: (token: string, userId: string) => void): Promise<string | null> {
    const hashedPassword = hashPassword(password);
    const requestBody: LoginRequestBody = {
      username: username,
      hashPassword: hashedPassword,
    };

    try {
      const response = await ApiUtils.API_INSTANCE_JSON.post("/login", requestBody);
      const token = response.data.token;
      const userId = response.data.userId;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      login(token, userId);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          throw new Error("Identifiant ou mot de passe incorrect.");
        }
      }
      return null;
    }
  }

  static async logout(logout: () => void): Promise<void> {
    try {
      logout();
    } catch (error) {
      throw new Error("Erreur lors de la déconnexion.");
    }
  }
}