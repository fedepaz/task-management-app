export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  tags?: string[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}
