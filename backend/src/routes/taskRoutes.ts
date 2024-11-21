import express from "express";
import * as taskController from "../controllers/taskController";
import authMiddleware from "../middlewares/authMiddleware";

const taskRoutes = express.Router();

taskRoutes.use(authMiddleware);

taskRoutes.post("/", taskController.createTask);
taskRoutes.get("/", taskController.getTasks);
taskRoutes.put("/:id", taskController.updateTask);
taskRoutes.delete("/:id", taskController.deleteTask);

export default taskRoutes;
