import { TagModel } from "../models/Tag";
import { Tag } from "@task-app/shared/src/types/tag";

export class TagsService {
  async createTag(tagData: string): Promise<Tag> {
    const existingTag = await TagModel.findOne({ name: tagData });

    if (existingTag) {
      return existingTag;
    }

    const newTag = new TagModel({
      name: tagData,
    });
    const savedTag = await newTag.save();
    return savedTag;
  }
  async getTagsByIds(ids: string[]): Promise<Tag[]> {
    if (!ids?.length) return [];

    const tags = await TagModel.find({
      _id: { $in: ids },
    });

    return tags;
  }

  async getAllTags(): Promise<Tag[]> {
    return TagModel.find({});
  }

  async searchTags(query: string): Promise<Tag[]> {
    const tags = TagModel.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);
    console.log(tags);
    return tags;
  }
}
