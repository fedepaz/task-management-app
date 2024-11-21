import { NextFunction } from "express";
import Task from "../models/Task";

export const createTask = async (req: any, res: any, next: NextFunction) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: any, res: any, next: NextFunction) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: any, res: any, next: NextFunction) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: any, res: any, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
