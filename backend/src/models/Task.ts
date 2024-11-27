import { Schema, model } from "mongoose";
import { Task } from "@task-app/shared/src/types/task";

const taskSchema = new Schema<Task>({
  title: { type: String, required: true },
  description: String,
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM",
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
    default: "TODO",
  },
  tags: [String],
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const TaskModel = model("Task", taskSchema);
