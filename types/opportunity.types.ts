import { ICompany } from "./company.types";
import { ICategory } from "./category.types";
import { JobType, WorkMode, OpportunityType, SalaryType, OpportunityStatus } from "@/lib/constants/jobTypes";

export interface IOpportunity {
  _id: string;
  title: string;
  slug: string;
  type: OpportunityType;
  company: ICompany | string;
  category: ICategory | string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  jobType?: JobType;
  workMode?: WorkMode;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: SalaryType;
  salaryCurrency?: string;
  isPaid?: boolean;
  education?: string;
  experience?: string;
  applicationUrl: string;
  deadline?: Date;
  status: OpportunityStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
