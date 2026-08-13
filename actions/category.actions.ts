"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";
import { Opportunity } from "@/models/Opportunity";
import { categorySchema, CategoryInput } from "@/validations/category.schema";
import { generateSlug } from "@/lib/utils/slug";
import { ICategory } from "@/types/category.types";
import { DEFAULT_CATEGORIES } from "@/lib/constants/categories";

export async function seedCategories() {
  try {
    await connectToDatabase();
    const count = await Category.countDocuments();

    if (count === 0) {
      const categoriesToCreate = DEFAULT_CATEGORIES.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        seoTitle: `${cat.name} Jobs & Internships | CareerHub`,
        seoDescription: `Find latest ${cat.name} jobs and internships for freshers and students.`,
      }));

      await Category.insertMany(categoriesToCreate);
      console.log(`[Seed] Initial ${categoriesToCreate.length} categories seeded.`);
    }
  } catch (error) {
    console.error("[seedCategories Error]:", error);
  }
}

export async function getCategories(search?: string): Promise<ICategory[]> {
  try {
    await connectToDatabase();

    // Auto seed if database has 0 categories
    await seedCategories();

    const query: Record<string, unknown> = {};
    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const categories = await Category.find(query).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("[getCategories Error]:", error);
    return [];
  }
}

export async function getCategoriesWithCounts(): Promise<(ICategory & { count: number })[]> {
  try {
    await connectToDatabase();
    await seedCategories();

    const categories = await Category.find({}).sort({ name: 1 }).lean();

    // Aggregate opportunity counts by category
    const counts = await Opportunity.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((item) => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    const result = categories.map((cat) => ({
      ...cat,
      count: countMap[cat._id.toString()] || 0,
    }));

    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("[getCategoriesWithCounts Error]:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<ICategory | null> {
  try {
    await connectToDatabase();
    const category = await Category.findById(id).lean();
    if (!category) return null;
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("[getCategoryById Error]:", error);
    return null;
  }
}

export async function createCategory(input: CategoryInput) {
  try {
    const validated = categorySchema.parse(input);
    await connectToDatabase();

    const slug = validated.slug && validated.slug.trim() !== ""
      ? generateSlug(validated.slug)
      : generateSlug(validated.name);

    const existing = await Category.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36).slice(-4)}` : slug;

    const category = await Category.create({
      ...validated,
      slug: finalSlug,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    console.error("[createCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create category" };
  }
}

export async function updateCategory(id: string, input: CategoryInput) {
  try {
    const validated = categorySchema.parse(input);
    await connectToDatabase();

    const existing = await Category.findById(id);
    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    let slug = existing.slug;
    if (validated.slug && validated.slug.trim() !== "") {
      slug = generateSlug(validated.slug);
    } else if (validated.name !== existing.name) {
      slug = generateSlug(validated.name);
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        ...validated,
        slug,
      },
      { new: true, runValidators: true }
    ).lean();

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, category: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("[updateCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDatabase();
    await Category.findByIdAndDelete(id);

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("[deleteCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete category" };
  }
}
