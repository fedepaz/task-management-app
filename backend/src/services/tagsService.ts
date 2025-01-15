import { Types } from "mongoose";
import { TagModel } from "../models/Tag";
import { Tag } from "@task-app/shared/src/types/tag";
import e from "express";

export class TagsService {
  async createTag(tagData: string): Promise<Tag> {
    const existingTag = await TagModel.findOne({ tagData });

    if (existingTag) {
      return existingTag;
    }
    const newTag = new TagModel({
      tagData,
    });
    const savedTag = await newTag.save();
    return savedTag;
  }

  async getTags(query: any): Promise<Tag[]> {
    const tags = await TagModel.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);

    return tags;
  }
}
