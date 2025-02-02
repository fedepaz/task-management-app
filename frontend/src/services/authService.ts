import axios from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
  SessionResponse,
} from "@task-app/shared";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axiosInstance.post<{ user: AuthUser }>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await axiosInstance.post<{ user: AuthUser }>(
      "/auth/register",
      credentials
    );
    return response.data;
  },

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get<SessionResponse>("/session");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return { authenticated: false, user: null };
      }
      throw error;
    }
  },

  async logout() {
    const response = await axiosInstance.post("/logout");
    return response.data;
  },
};
