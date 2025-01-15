import express from "express";
import { TagsController } from "../controllers/tagsController";
import authMiddleware from "../middlewares/authMiddleware";

const tagsRoutes = express.Router();
const tagsController = new TagsController();

tagsRoutes.use(authMiddleware);

tagsRoutes.post("/", tagsController.createTag);
tagsRoutes.get("/", tagsController.getTags);
tagsRoutes.get("/search", tagsController.getTags);

export default tagsRoutes;
