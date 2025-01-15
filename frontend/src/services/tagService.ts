import axios from "axios";
import { Tag } from "@task-app/shared/src/types/tag";

const API_URL = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const tagService = {
  searchTags: (query: string) =>
    axiosInstance.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}`),

  createTag: (name: string) => axiosInstance.post<Tag>(`/tags`, { name }),

  getTags: () => axiosInstance.get<Tag[]>(`/tags`),
};
