import { NextFunction, Request, Response } from "express";
import { TagsService } from "../services/tagsService";

export class TagsController {
  private tagsService: TagsService;

  constructor() {
    this.tagsService = new TagsService();
  }

  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagsService.createTag(req.body.name);

      res.status(201).json({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
      });
    } catch (error) {
      console.error("Error creating tag:", error);
      next(error);
    }
  };
  getTagsByIds = async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid tags array" });
    }
    try {
      const tags = await this.tagsService.getTagsByIds(ids);

      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };
  searchTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const tags = await this.tagsService.searchTags(query);
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };

  getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.tagsService.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };
}
