import axios from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
  SessionResponse,
} from "@task-app/shared";

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "access_token";
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axiosInstance.post<{
      user: AuthUser;
      token: string;
    }>("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
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
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    const response = await axiosInstance.post("/logout");
    return response.data;
  },
};
