import mongoose, { Schema, Document, Model } from "mongoose";
import { IOpportunity } from "@/types/opportunity.types";

export interface IOpportunityDocument
  extends Omit<IOpportunity, "_id" | "company" | "category">,
    Document {
  company: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
}

const OpportunitySchema = new Schema<IOpportunityDocument>(
  {
    title: {
      type: String,
      required: [true, "Opportunity title is required"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["job", "internship", "offcampus", "wfh"],
      required: [true, "Opportunity type is required"],
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance"],
      default: "full-time",
    },
    workMode: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    location: {
      type: String,
      default: "",
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryType: {
      type: String,
      enum: ["monthly", "yearly", "stipend", "unpaid"],
      default: "monthly",
    },
    salaryCurrency: {
      type: String,
      default: "INR",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    education: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "fresher",
    },
    applicationUrl: {
      type: String,
      required: [true, "Application URL is required"],
      trim: true,
    },
    deadline: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "expired"],
      default: "published",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
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
    seoKeywords: {
      type: [String],
      default: [],
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

// Compound index for optimized querying on listing pages
OpportunitySchema.index({ type: 1, status: 1, publishedAt: -1 });
OpportunitySchema.index({ category: 1, status: 1, publishedAt: -1 });

export const Opportunity: Model<IOpportunityDocument> =
  mongoose.models.Opportunity ||
  mongoose.model<IOpportunityDocument>("Opportunity", OpportunitySchema);
