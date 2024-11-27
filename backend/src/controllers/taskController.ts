import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/taskService";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.createTask(req.body);

      res.status(201).json({
        message: "Task created successfully",
        task,
      });
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getTasks(req);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.updateTask(
        req,
        req.params.id,
        req.body
      );

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.taskService.deleteTask(req, req.params.id);

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
