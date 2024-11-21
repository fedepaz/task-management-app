import { z } from "zod";

export const TaskPriority = z.enum(["low", "medium", "high"]);
export const TaskStatus = z.enum(["todo", "in-progress", "completed"]);

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: TaskStatus.default("todo"),
  priority: TaskPriority.default("medium"),
  dueDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const validateTask = (task: unknown) => {
  return TaskSchema.parse(task);
};
