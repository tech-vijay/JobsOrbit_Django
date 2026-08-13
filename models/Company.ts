import mongoose, { Schema, Document, Model } from "mongoose";
import { ICompany } from "@/types/company.types";

export interface ICompanyDocument extends Omit<ICompany, "_id">, Document {}

const CompanySchema = new Schema<ICompanyDocument>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Company slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default: "",
    },
    logoPublicId: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Company: Model<ICompanyDocument> =
  mongoose.models.Company ||
  mongoose.model<ICompanyDocument>("Company", CompanySchema);
