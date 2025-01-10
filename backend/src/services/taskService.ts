import { Types } from "mongoose";
import { TaskModel } from "../models/Task";
import { Task } from "@task-app/shared/src/types/task";

export class TaskService {
  async createTask(taskData: Partial<Task>): Promise<Task> {
    const userId =
      typeof taskData.user === "object"
        ? (taskData.user as any).user
        : taskData.user;

    const newTask = new TaskModel({
      ...taskData,
      user: new Types.ObjectId(userId),
    });
    const savedTask = await newTask.save();

    return savedTask;
  }

  async getTasks(req: any): Promise<Task[]> {
    const tasks = await TaskModel.find({ user: req.user.id });

    return tasks;
  }

  async updateTask(
    req: any,
    taskId: string,
    taskData: Partial<Task>
  ): Promise<Task> {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      taskData,
      { new: true }
    );

    if (!updatedTask) {
      throw new Error("Task not found");
    }

    return updatedTask;
  }

  async deleteTask(req: any, taskId: string): Promise<void> {
    const deletedTask = await TaskModel.findOneAndDelete({
      _id: taskId,
      user: req.user.id,
    });

    if (!deletedTask) {
      throw new Error("Task not found");
    }
  }
}
