import axios from "axios";
import { Task } from "@task-app/shared";

const API_URL = import.meta.env.VITE_API_URL;

export const taskService = {
  getTasks: () => axios.get<Task[]>(`${API_URL}/tasks`),
  createTask: (taskData: Partial<Task>) =>
    axios.post<Task>(`${API_URL}/tasks`, taskData),
  updateTask: (id: string, taskData: Partial<Task>) =>
    axios.put<Task>(`${API_URL}/tasks/${id}`, taskData),
  deleteTask: (id: string) => axios.delete(`${API_URL}/tasks/${id}`),
};
