import express from "express";
import { AuthController } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";
const sessionRoutes = express.Router();
const authController = new AuthController();

sessionRoutes.get("/session", asyncHandler(authController.loggedIn));
sessionRoutes.post("/logout", asyncHandler(authController.logout));

export default sessionRoutes;
