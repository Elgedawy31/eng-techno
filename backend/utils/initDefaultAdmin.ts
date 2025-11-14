import { UserModel } from "../models/user.model";
import { env } from "../config/env";
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError";

export async function initDefaultAdmin(): Promise<void> {
  try {
    // Check if any users exist
    const userCount = await UserModel.countDocuments();

    if (userCount === 0) {
      // Validate required environment variables
      if (!env.defaultAdminEmail || !env.defaultAdminPassword) {
        throw new AppError(
          "Default admin email and password must be configured",
          500
        );
      }

      // Hash the default password
      const hashedPassword = await bcrypt.hash(env.defaultAdminPassword, 10);

      // Create default admin user
      try {
        await UserModel.create({
          name: env.defaultAdminName,
          email: env.defaultAdminEmail.toLowerCase(),
          password: hashedPassword,
          role: "admin",
        });
      } catch (createError: any) {
        if (createError.code === 11000) {
          throw new AppError("Default admin email already exists", 409);
        }
        throw new AppError(
          `Failed to create default admin: ${createError.message}`,
          500
        );
      }
    } else {
      console.log(`Users already exist (${userCount} users found). Skipping default admin creation.`);
    }
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`❌ Error initializing default admin: ${error.message}`);
      // In production, you might want to throw here to prevent server start
      // For now, we log and continue to allow server to start
    } else {
      console.error("❌ Unexpected error initializing default admin:", error);
    }
    // Don't throw - allow server to start even if admin creation fails
    // Remove this comment and uncomment the throw if you want server to fail on admin creation error
    // throw error;
  }
}

