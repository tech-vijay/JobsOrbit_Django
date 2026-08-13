import mongoose, { Schema, Document, Model } from "mongoose";
import { IBlogPost } from "@/types/blog.types";

export interface IBlogPostDocument
  extends Omit<IBlogPost, "_id" | "author">,
    Document {
  author: mongoose.Types.ObjectId;
}

const BlogPostSchema = new Schema<IBlogPostDocument>(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    coverImageId: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Career Advice",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    seoTitle: {
      type: String,
      default: "",
    },
    seoDescription: {
      type: String,
      default: "",
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogPost: Model<IBlogPostDocument> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPostDocument>("BlogPost", BlogPostSchema);
