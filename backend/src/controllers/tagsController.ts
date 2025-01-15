import { NextFunction, Request, Response } from "express";
import { TagsService } from "../services/tagsService";

export class TagsController {
  private tagsService: TagsService;

  constructor() {
    this.tagsService = new TagsService();
  }

  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagsService.createTag(req.body);

      res.status(201).json({
        message: "Tag created successfully",
        tag,
      });
    } catch (error) {
      next(error);
    }
  };

  getTags = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query.q as string;

    try {
      const tags = await this.tagsService.getTags(query);

      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };
}
