export const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
] as const;

export const WORK_MODES = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const OPPORTUNITY_TYPES = [
  { value: "job", label: "Job" },
  { value: "internship", label: "Internship" },
  { value: "offcampus", label: "Off-campus" },
  { value: "wfh", label: "Work from Home" },
] as const;

export const SALARY_TYPES = [
  { value: "monthly", label: "Per Month" },
  { value: "yearly", label: "Per Year" },
  { value: "stipend", label: "Stipend" },
  { value: "unpaid", label: "Unpaid" },
] as const;

export const OPPORTUNITY_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "expired", label: "Expired" },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher (0 years)" },
  { value: "0-1", label: "0–1 years" },
  { value: "1-2", label: "1–2 years" },
  { value: "2-3", label: "2–3 years" },
  { value: "3+", label: "3+ years" },
] as const;

export type JobType = (typeof JOB_TYPES)[number]["value"];
export type WorkMode = (typeof WORK_MODES)[number]["value"];
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]["value"];
export type SalaryType = (typeof SALARY_TYPES)[number]["value"];
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number]["value"];
