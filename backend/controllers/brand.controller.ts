import type { Request, Response, NextFunction } from "express";
import { BrandModel } from "../models/brand.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";
import { deleteFile } from "../utils/upload";

// Validation schemas
const createBrandSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف"),
});

const updateBrandSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف").optional(),
});

// Get all brands
export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const brands = await BrandModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BrandModel.countDocuments();

    sendResponse(res, 200, {
      success: true,
      message: "Brands retrieved successfully",
      data: {
        brands,
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

// Get single brand by ID
export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const brand = await BrandModel.findById(id);

    if (!brand) {
      throw new AppError("الماركة غير موجودة", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Brand retrieved successfully",
      data: { brand },
    });
  } catch (error) {
    next(error);
  }
};

// Create new brand
export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createBrandSchema.parse(req.body);
    const file = req.file;

    // Check if brand with same name already exists
    const existingBrand = await BrandModel.findOne({
      name: validatedData.name.trim(),
    });

    if (existingBrand) {
      throw new AppError("الماركة موجودة بالفعل", 409);
    }

    // Get image path if file uploaded
    let imagePath: string | undefined;
    if (file) {
      imagePath = `/uploads/brands/${file.filename}`;
    }

    const brand = await BrandModel.create({
      name: validatedData.name.trim(),
      image: imagePath,
    });

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة الماركة بنجاح!",
      data: { brand },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await deleteFile(`/uploads/brands/${req.file.filename}`);
      } catch (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    }

    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الماركة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Update brand
export const updateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateBrandSchema.parse(req.body);
    const file = req.file;

    const brand = await BrandModel.findById(id);

    if (!brand) {
      throw new AppError("الماركة غير موجودة", 404);
    }

    // Check if brand with same name already exists (if name is being updated)
    if (validatedData.name) {
      const existingBrand = await BrandModel.findOne({
        name: validatedData.name.trim(),
        _id: { $ne: id },
      });

      if (existingBrand) {
        throw new AppError("الماركة موجودة بالفعل", 409);
      }
    }

    // Handle image update
    let imagePath = brand.image;
    if (file) {
      // Delete old image if exists
      if (brand.image) {
        try {
          await deleteFile(brand.image);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }
      imagePath = `/uploads/brands/${file.filename}`;
    }

    // Update brand
    Object.assign(brand, {
      ...(validatedData.name && { name: validatedData.name.trim() }),
      ...(file && { image: imagePath }),
    });

    await brand.save();

    const updatedBrand = await BrandModel.findById(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث الماركة بنجاح!",
      data: { brand: updatedBrand },
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await deleteFile(`/uploads/brands/${req.file.filename}`);
      } catch (err) {
        console.error("Failed to delete uploaded file:", err);
      }
    }

    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الماركة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Delete brand
export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const brand = await BrandModel.findById(id);

    if (!brand) {
      throw new AppError("الماركة غير موجودة", 404);
    }

    // Delete associated image if exists
    if (brand.image) {
      try {
        await deleteFile(brand.image);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    await BrandModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف الماركة بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

