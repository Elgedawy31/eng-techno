import type { Request, Response, NextFunction } from "express";
import { AboutPageHeroModel } from "../models/aboutPageHero.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getAboutPageHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hero = await AboutPageHeroModel.findOne({ isActive: true });

    if (!hero) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active about page hero found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "About page hero retrieved successfully",
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutPageHeroById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const hero = await AboutPageHeroModel.findById(id);

    if (!hero) {
      throw new AppError("About page hero not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "About page hero retrieved successfully",
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAboutPageHeroes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const heroes = await AboutPageHeroModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "About page heroes retrieved successfully",
      data: heroes,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateAboutPageHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, isActive } = req.body;

    if (!title) {
      throw new AppError("Title is required", 400);
    }

    const file = req.file;
    if (!file) {
      throw new AppError("Background image is required", 400);
    }

    // Get relative path for storage
    const relativePath = getRelativePath(file.path);
    const imagePath = `/uploads/${relativePath}`;

    // Check if hero already exists (singleton pattern)
    const existingHero = await AboutPageHeroModel.findOne();

    if (existingHero) {
      // Delete old image if it exists
      if (existingHero.backgroundImage) {
        const oldImagePath = existingHero.backgroundImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Update existing hero
      existingHero.backgroundImage = imagePath;
      existingHero.title = title;
      if (isActive !== undefined) {
        existingHero.isActive = isActive === "true" || isActive === true;
      }

      await existingHero.save();

      return sendResponse(res, 200, {
        success: true,
        message: "About page hero updated successfully",
        data: existingHero,
      });
    } else {
      // Create new hero
      const hero = await AboutPageHeroModel.create({
        backgroundImage: imagePath,
        title,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "About page hero created successfully",
        data: hero,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAboutPageHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, isActive } = req.body;
    const file = req.file;

    const hero = await AboutPageHeroModel.findById(id);

    if (!hero) {
      throw new AppError("About page hero not found", 404);
    }

    // If new image is uploaded, delete old one
    if (file) {
      if (hero.backgroundImage) {
        const oldImagePath = hero.backgroundImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      const relativePath = getRelativePath(file.path);
      hero.backgroundImage = `/uploads/${relativePath}`;
    }

    // Update other fields if provided
    if (title) hero.title = title;
    if (isActive !== undefined) {
      hero.isActive = isActive === "true" || isActive === true;
    }

    await hero.save();

    sendResponse(res, 200, {
      success: true,
      message: "About page hero updated successfully",
      data: hero,
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

    const hero = await AboutPageHeroModel.findById(id);

    if (!hero) {
      throw new AppError("About page hero not found", 404);
    }

    hero.isActive = !hero.isActive;
    await hero.save();

    sendResponse(res, 200, {
      success: true,
      message: `About page hero ${hero.isActive ? "activated" : "deactivated"} successfully`,
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAboutPageHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const hero = await AboutPageHeroModel.findById(id);

    if (!hero) {
      throw new AppError("About page hero not found", 404);
    }

    // Delete associated image
    if (hero.backgroundImage) {
      const imagePath = hero.backgroundImage.replace("/uploads/", "uploads/");
      try {
        await deleteFile(imagePath);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    await AboutPageHeroModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "About page hero deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

