import type { Request, Response, NextFunction } from "express";
import { BannerModel } from "../models/banner.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile } from "../utils/upload";
import { z } from "zod";
import { ZodError } from "zod";

// Validation schemas
const createBannerSchema = z.object({
  bannername: z.string().min(1).max(255),
  expiration_date: z.string().or(z.date()),
});

const updateBannerSchema = z.object({
  bannername: z.string().min(1).max(255).optional(),
  expiration_date: z.string().or(z.date()).optional(),
});

// Get all banners
export const getAllBanners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter out expired banners if needed
    const filter: any = {};
    if (req.query.active === "true") {
      filter.expiration_date = { $gte: new Date() };
    }

    const banners = await BannerModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BannerModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Banners retrieved successfully",
      data: {
        banners,
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

// Get single banner by ID
export const getBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const banner = await BannerModel.findById(id);

    if (!banner) {
      throw new AppError("البانر غير موجود", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Banner retrieved successfully",
      data: { banner },
    });
  } catch (error) {
    next(error);
  }
};

// Create new banner
export const createBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createBannerSchema.parse(req.body);
    const files = req.files as {
      large_image?: Express.Multer.File[];
      small_image?: Express.Multer.File[];
    };

    if (!files?.large_image || files.large_image.length === 0) {
      throw new AppError("يجب إدخال الاسم وتحميل الصورة الكبيرة!", 400);
    }

    // Get file paths
    const imagePathLg = `/uploads/banners/${files?.large_image?.[0]?.filename}`;
    const imagePathSm = files.small_image?.[0]
      ? `/uploads/banners/${files.small_image[0].filename}`
      : null;

    // Parse expiration date
    const expirationDate = validatedData.expiration_date
      ? new Date(validatedData.expiration_date)
      : new Date();

    const banner = await BannerModel.create({
      bannername: validatedData.bannername,
      image_path_lg: imagePathLg,
      image_path_small: imagePathSm,
      expiration_date: expirationDate,
    });

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة البانر بنجاح!",
      data: { banner },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

// Update banner
export const updateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateBannerSchema.parse(req.body);
    const files = req.files as {
      large_image?: Express.Multer.File[];
      small_image?: Express.Multer.File[];
    };

    const banner = await BannerModel.findById(id);

    if (!banner) {
      throw new AppError("البانر غير موجود", 404);
    }

    // Handle image updates
    let imagePathLg = banner.image_path_lg;
    let imagePathSm = banner.image_path_small;

    if (files?.large_image && files.large_image.length > 0) {
      // Delete old large image
      if (banner.image_path_lg) {
        try {
          await deleteFile(banner.image_path_lg);
        } catch (err) {
          console.error("Failed to delete old large image:", err);
        }
      }
      imagePathLg = `/uploads/banners/${files?.large_image?.[0]?.filename}`;
    }

    if (files?.small_image && files.small_image.length > 0) {
      // Delete old small image
      if (banner.image_path_small) {
        try {
          await deleteFile(banner.image_path_small);
        } catch (err) {
          console.error("Failed to delete old small image:", err);
        }
      }
      imagePathSm = `/uploads/banners/${files?.small_image?.[0]?.filename}`;
    }

    // Update banner
    const updateData: any = {
      bannername: validatedData.bannername || banner.bannername,
      image_path_lg: imagePathLg,
      image_path_small: imagePathSm,
    };

    if (validatedData.expiration_date) {
      updateData.expiration_date = new Date(validatedData.expiration_date);
    }

    const updatedBanner = await BannerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث البانر بنجاح!",
      data: { banner: updatedBanner },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

// Delete banner
export const deleteBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const banner = await BannerModel.findById(id);

    if (!banner) {
      throw new AppError("البانر غير موجود", 404);
    }

    // Delete associated images
    if (banner.image_path_lg) {
      try {
        await deleteFile(banner.image_path_lg);
      } catch (err) {
        console.error("Failed to delete large image:", err);
      }
    }

    if (banner.image_path_small) {
      try {
        await deleteFile(banner.image_path_small);
      } catch (err) {
        console.error("Failed to delete small image:", err);
      }
    }

    await BannerModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف البانر بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

