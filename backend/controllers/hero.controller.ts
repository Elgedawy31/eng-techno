import type { Request, Response, NextFunction } from "express";
import { HeroModel } from "../models/hero.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hero = await HeroModel.findOne({ isActive: true });

    if (!hero) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active hero section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Hero section retrieved successfully",
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const getHeroById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const hero = await HeroModel.findById(id);

    if (!hero) {
      throw new AppError("Hero section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Hero section retrieved successfully",
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHeroes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const heroes = await HeroModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Hero sections retrieved successfully",
      data: heroes,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { headline, subtitle, buttonText, buttonAction, isActive } = req.body;

    if (!headline || !subtitle || !buttonText || !buttonAction) {
      throw new AppError(
        "Headline, subtitle, buttonText, and buttonAction are required",
        400
      );
    }

    const file = req.file;
    if (!file) {
      throw new AppError("Background image is required", 400);
    }

    // Get relative path for storage
    const relativePath = getRelativePath(file.path);
    const imagePath = `/uploads/${relativePath}`;

    // Check if hero already exists (singleton pattern)
    const existingHero = await HeroModel.findOne();

    if (existingHero) {
      // Delete old image if it exists
      if (existingHero.backgroundImage) {
        const oldImagePath = existingHero.backgroundImage.replace(
          "/uploads/",
          "uploads/"
        );
        try {
          await deleteFile(oldImagePath);
        } catch (error) {
          // Log error but don't fail the update
          console.error("Error deleting old image:", error);
        }
      }

      // Update existing hero
      existingHero.backgroundImage = imagePath;
      existingHero.headline = headline;
      existingHero.subtitle = subtitle;
      existingHero.buttonText = buttonText;
      existingHero.buttonAction = buttonAction;
      if (isActive !== undefined) {
        existingHero.isActive = isActive === "true" || isActive === true;
      }

      await existingHero.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Hero section updated successfully",
        data: existingHero,
      });
    } else {
      // Create new hero
      const hero = await HeroModel.create({
        backgroundImage: imagePath,
        headline,
        subtitle,
        buttonText,
        buttonAction,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Hero section created successfully",
        data: hero,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { headline, subtitle, buttonText, buttonAction, isActive } = req.body;
    const file = req.file;

    const hero = await HeroModel.findById(id);

    if (!hero) {
      throw new AppError("Hero section not found", 404);
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
    if (headline) hero.headline = headline;
    if (subtitle) hero.subtitle = subtitle;
    if (buttonText) hero.buttonText = buttonText;
    if (buttonAction) hero.buttonAction = buttonAction;
    if (isActive !== undefined) {
      hero.isActive = isActive === "true" || isActive === true;
    }

    await hero.save();

    sendResponse(res, 200, {
      success: true,
      message: "Hero section updated successfully",
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

    const hero = await HeroModel.findById(id);

    if (!hero) {
      throw new AppError("Hero section not found", 404);
    }

    hero.isActive = !hero.isActive;
    await hero.save();

    sendResponse(res, 200, {
      success: true,
      message: `Hero section ${hero.isActive ? "activated" : "deactivated"} successfully`,
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHero = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const hero = await HeroModel.findById(id);

    if (!hero) {
      throw new AppError("Hero section not found", 404);
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

    await HeroModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Hero section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

