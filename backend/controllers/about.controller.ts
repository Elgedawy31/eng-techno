import type { Request, Response, NextFunction } from "express";
import { AboutModel } from "../models/about.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const about = await AboutModel.findOne({ isActive: true });

    if (!about) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active about section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "About section retrieved successfully",
      data: about,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const about = await AboutModel.findById(id);

    if (!about) {
      throw new AppError("About section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "About section retrieved successfully",
      data: about,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAbouts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const abouts = await AboutModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "About sections retrieved successfully",
      data: abouts,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      label,
      description,
      button1Text,
      button1Action,
      button2Text,
      button2Action,
      isActive,
    } = req.body;

    if (!description || !button1Text || !button1Action || !button2Text) {
      throw new AppError(
        "Description, button1Text, button1Action, and button2Text are required",
        400
      );
    }

    const file = req.file;
    let filePath: string | undefined;

    if (file) {
      const relativePath = getRelativePath(file.path);
      filePath = `/uploads/${relativePath}`;
    }

    // Check if about already exists (singleton pattern)
    const existingAbout = await AboutModel.findOne();

    if (existingAbout) {
      // Delete old file if new one is uploaded
      if (file && existingAbout.companyProfileFile) {
        const oldFilePath = existingAbout.companyProfileFile.replace(
          "/uploads/",
          "uploads/"
        );
        try {
          await deleteFile(oldFilePath);
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      // Update existing about
      if (label !== undefined) existingAbout.label = label;
      existingAbout.description = description;
      existingAbout.button1Text = button1Text;
      existingAbout.button1Action = button1Action;
      existingAbout.button2Text = button2Text;
      if (button2Action !== undefined) existingAbout.button2Action = button2Action;
      if (filePath) existingAbout.companyProfileFile = filePath;
      if (isActive !== undefined) {
        existingAbout.isActive = isActive === "true" || isActive === true;
      }

      await existingAbout.save();

      return sendResponse(res, 200, {
        success: true,
        message: "About section updated successfully",
        data: existingAbout,
      });
    } else {
      // Create new about
      const about = await AboutModel.create({
        label: label || "//DEFINING TECHNO",
        description,
        button1Text,
        button1Action,
        button2Text,
        button2Action: button2Action || filePath || "",
        companyProfileFile: filePath,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "About section created successfully",
        data: about,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      label,
      description,
      button1Text,
      button1Action,
      button2Text,
      button2Action,
      isActive,
    } = req.body;
    const file = req.file;

    const about = await AboutModel.findById(id);

    if (!about) {
      throw new AppError("About section not found", 404);
    }

    // If new file is uploaded, delete old one
    if (file) {
      if (about.companyProfileFile) {
        const oldFilePath = about.companyProfileFile.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldFilePath);
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      const relativePath = getRelativePath(file.path);
      about.companyProfileFile = `/uploads/${relativePath}`;
    }

    // Update other fields if provided
    if (label !== undefined) about.label = label;
    if (description) about.description = description;
    if (button1Text) about.button1Text = button1Text;
    if (button1Action) about.button1Action = button1Action;
    if (button2Text) about.button2Text = button2Text;
    if (button2Action !== undefined) about.button2Action = button2Action;
    if (isActive !== undefined) {
      about.isActive = isActive === "true" || isActive === true;
    }

    await about.save();

    sendResponse(res, 200, {
      success: true,
      message: "About section updated successfully",
      data: about,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleActive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const about = await AboutModel.findById(id);

    if (!about) {
      throw new AppError("About section not found", 404);
    }

    about.isActive = !about.isActive;
    await about.save();

    sendResponse(res, 200, {
      success: true,
      message: `About section ${about.isActive ? "activated" : "deactivated"} successfully`,
      data: about,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAbout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const about = await AboutModel.findById(id);

    if (!about) {
      throw new AppError("About section not found", 404);
    }

    // Delete associated file
    if (about.companyProfileFile) {
      const filePath = about.companyProfileFile.replace("/uploads/", "uploads/");
      try {
        await deleteFile(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    await AboutModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "About section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

