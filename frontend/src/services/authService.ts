import axios from "axios";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthUser,
  SessionResponse,
} from "@task-app/shared";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post<{ user: AuthUser; token: string }>(
      `${API_URL}/auth/login`,
      credentials,
      { withCredentials: true }
    );
    console.log("Login Service - Full Response:", response);
    console.log("Login Service - User:", response.data.user);
    return response.data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await axios.post<{ user: AuthUser }>(
      `${API_URL}/auth/register`,
      credentials
    );
    return response.data;
  },
  async getCurrentUser() {
    const response = await axios.get<SessionResponse>(`${API_URL}/session`, {
      withCredentials: true,
    });
    console.log("Get Current User Response:", response.data);
    return response.data;
  },
};
