import express from "express";
import { TagsController } from "../controllers/tagsController";
import authMiddleware from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

const tagsRoutes = express.Router();
const tagsController = new TagsController();

tagsRoutes.use(authMiddleware);

tagsRoutes.post("/batch", asyncHandler(tagsController.getTagsByIds));
tagsRoutes.post("/", tagsController.createTag);
tagsRoutes.get("/", tagsController.getTags);
tagsRoutes.get("/search", asyncHandler(tagsController.searchTags));

export default tagsRoutes;
