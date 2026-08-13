import { IUser } from "./user.types";

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  coverImageId?: string;
  category?: string;
  tags?: string[];
  author?: IUser | string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
