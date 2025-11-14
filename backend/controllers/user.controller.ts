import type { Request, Response, NextFunction } from "express";
import { UserModel, BRANCHES } from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import { deleteFile } from "../utils/upload";

// Validation schemas
const createUserSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب").max(500, "الاسم يجب أن يكون أقل من 500 حرف"),
    email: z.string().email("البريد الإلكتروني غير صحيح").max(500, "البريد الإلكتروني يجب أن يكون أقل من 500 حرف"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف").max(255, "كلمة المرور يجب أن تكون أقل من 255 حرف").optional(),
    role: z.enum(["user", "admin", "sales"]).default("user"),
    rating: z.coerce.number().min(0, "التقييم يجب أن يكون بين 0 و 5").max(5, "التقييم يجب أن يكون بين 0 و 5").optional(),
    whatsNumber: z.string().min(1, "رقم الواتساب مطلوب").max(20, "رقم الواتساب يجب أن يكون أقل من 20 حرف").optional(),
    phoneNumber: z.string().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف يجب أن يكون أقل من 20 حرف").optional(),
    branch: z
      .string()
      .refine((val) => !val || BRANCHES.includes(val as any), {
        message: "الفرع غير صحيح",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Branch is required if role is "sales"
      if (data.role === "sales" && !data.branch) {
        return false;
      }
      return true;
    },
    {
      message: "الفرع مطلوب للدور مندوب مبيعات",
      path: ["branch"],
    }
  );

const updateUserSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب").max(500, "الاسم يجب أن يكون أقل من 500 حرف").optional(),
    email: z.string().email("البريد الإلكتروني غير صحيح").max(500, "البريد الإلكتروني يجب أن يكون أقل من 500 حرف").optional(),
    password: z.string().min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف").max(255, "كلمة المرور يجب أن تكون أقل من 255 حرف").optional(),
    role: z.enum(["user", "admin", "sales"]).optional(),
    rating: z.coerce.number().min(0, "التقييم يجب أن يكون بين 0 و 5").max(5, "التقييم يجب أن يكون بين 0 و 5").optional(),
    whatsNumber: z.string().min(1, "رقم الواتساب مطلوب").max(20, "رقم الواتساب يجب أن يكون أقل من 20 حرف").optional(),
    phoneNumber: z.string().min(1, "رقم الهاتف مطلوب").max(20, "رقم الهاتف يجب أن يكون أقل من 20 حرف").optional(),
    branch: z
      .string()
      .refine((val) => !val || BRANCHES.includes(val as any), {
        message: "الفرع غير صحيح",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Branch is required if role is "sales"
      if (data.role === "sales" && !data.branch) {
        return false;
      }
      return true;
    },
    {
      message: "الفرع مطلوب للدور مندوب مبيعات",
      path: ["branch"],
    }
  );

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    // Build filter object
    const filter: any = {};

    // Filter by name (case-insensitive search)
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by role
    if (role && ["user", "admin", "sales"].includes(role)) {
      filter.role = role;
    }

    const users = await UserModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const file = req.file;

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: validatedData.email.toLowerCase(),
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 10);
    }

    // Get image path if file uploaded
    let imagePath: string | undefined;
    if (file) {
      imagePath = `/uploads/users/${file.filename}`;
    }

    const user = await UserModel.create({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      role: validatedData.role,
      rating: validatedData.rating,
      image: imagePath,
      whatsNumber: validatedData.whatsNumber,
      phoneNumber: validatedData.phoneNumber,
      branch: validatedData.branch,
    });

    const userResponse = await UserModel.findById(user._id).select("-password");

    sendResponse(res, 201, {
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("Email already exists", 409));
    }
    next(error);
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);
    const file = req.file;

    const user = await UserModel.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Determine the final role (new role or existing role)
    const finalRole = validatedData.role ?? user.role;

    // Validate branch requirement for sales role
    if (finalRole === "sales") {
      const finalBranch = validatedData.branch ?? user.branch;
      if (!finalBranch) {
        throw new AppError("الفرع مطلوب للدور مندوب مبيعات", 400);
      }
    }

    // Check if email is being changed and if it already exists
    if (validatedData.email && validatedData.email.toLowerCase() !== user.email) {
      const existingUser = await UserModel.findOne({
        email: validatedData.email.toLowerCase(),
      });

      if (existingUser) {
        throw new AppError("Email already in use", 409);
      }
    }

    // Hash password if provided
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }

    // Handle image update
    let imagePath = user.image;
    if (file) {
      // Delete old image if exists
      if (user.image) {
        try {
          await deleteFile(user.image);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }
      imagePath = `/uploads/users/${file.filename}`;
    }

    // Update user
    Object.assign(user, {
      ...validatedData,
      ...(validatedData.email && { email: validatedData.email.toLowerCase() }),
      ...(file && { image: imagePath }),
    });

    await user.save();

    const updatedUser = await UserModel.findById(id).select("-password");

    sendResponse(res, 200, {
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("Email already exists", 409));
    }
    next(error);
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Prevent users from deleting themselves
    if (req.user && req.user._id === id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const user = await UserModel.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete associated image
    if (user.image) {
      try {
        await deleteFile(user.image);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    await UserModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

// Get current user profile
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const user = await UserModel.findById(req.user._id).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User profile retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Get all sales (public endpoint)
export const getAllSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter - only sales role
    const filter: any = { role: "sales" };

    if (req.query.search && (req.query.search as string).trim()) {
      filter.name = { $regex: (req.query.search as string).trim(), $options: "i" };
    }
    if (req.query.branch) {
      filter.branch = req.query.branch;
    }
    if (req.query.rating) {
      filter.rating = { $gte: parseFloat(req.query.rating as string) };
    }

    const sales = await UserModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ create: -1 });

    const total = await UserModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "تم جلب المندوبين بنجاح",
      data: {
        sales,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get sales by branch (public endpoint)
export const getSalesByBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { branch } = req.params;

    if (!BRANCHES.includes(branch as any)) {
      throw new AppError("الفرع غير صحيح", 400);
    }

    const sales = await UserModel.find({ role: "sales", branch })
      .select("-password")
      .sort({ create: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "تم جلب المندوبين بنجاح",
      data: { sales },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

