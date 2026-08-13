import { connectToDatabase } from "@/lib/db/mongoose";
import { auth } from "@/lib/auth/auth";

export async function seedAdminUser() {
  try {
    await connectToDatabase();

    const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@careerhub.com";
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || "admin123456";

    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail.toLowerCase(),
          password: adminPassword,
          name: "Admin",
        },
      });
      console.log(`[Seed] Initial Superadmin created: ${adminEmail}`);
      return { success: true, message: `Initial admin created: ${adminEmail}` };
    } catch {
      return { success: true, message: "Admin user already exists." };
    }
  } catch (error) {
    console.error("[Seed Error] Failed to seed admin user:", error);
    return { success: false, error: (error as Error).message };
  }
}
