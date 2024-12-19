import axios from "axios";
import { Task } from "@task-app/shared";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const taskService = {
  getTasks: () => axiosInstance.get<Task[]>(`${API_URL}/tasks`),
  createTask: (taskData: Partial<Task>) =>
    axiosInstance.post<Task>(`${API_URL}/tasks`, taskData),
  updateTask: (id: string, taskData: Partial<Task>) =>
    axiosInstance.put<Task>(`${API_URL}/tasks/${id}`, taskData),
  deleteTask: (id: string) => axiosInstance.delete(`${API_URL}/tasks/${id}`),
};
