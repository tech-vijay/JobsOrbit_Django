export interface ICompany {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  logoPublicId?: string;
  website?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
