import { Tag } from "./tag";
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  tags?: Tag["id"][];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  user: object;
}
