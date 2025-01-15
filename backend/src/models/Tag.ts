import { Schema, model } from "mongoose";
import { Tag } from "@task-app/shared/src/types/tag";

const tagSchema = new Schema<Tag>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tagSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export const TagModel = model("Tag", tagSchema);
