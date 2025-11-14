import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import bcrypt from "bcryptjs";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

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
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email) {
      throw new AppError("Name and email are required", 400);
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "admin",
    });

    // Return user without password
    const userResponse = await UserModel.findById(user._id).select("-password");

    sendResponse(res, 201, {
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await UserModel.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if email is being changed and if it's already taken
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new AppError("User with this email already exists", 400);
      }
      user.email = email.toLowerCase();
    }

    // Update fields if provided
    if (name) user.name = name;
    if (role) user.role = role;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Return user without password
    const userResponse = await UserModel.findById(user._id).select("-password");

    sendResponse(res, 200, {
      success: true,
      message: "User updated successfully",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Prevent deleting yourself
    if (req.user && req.user._id === id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    await UserModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

