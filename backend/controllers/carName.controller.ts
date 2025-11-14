import type { Request, Response, NextFunction } from "express";
import { CarNameModel } from "../models/carName.model";
import { BrandModel } from "../models/brand.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";

// Validation schemas
const createCarNameSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف"),
  brandId: z.string().min(1, "معرف الماركة مطلوب"),
});

const updateCarNameSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف").optional(),
  brandId: z.string().min(1, "معرف الماركة مطلوب").optional(),
});

// Get all car names
export const getAllCarNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter by brandId if provided
    const filter: any = {};
    if (req.query.brandId) {
      filter.brandId = req.query.brandId;
    }

    const carNames = await CarNameModel.find(filter)
      .populate("brandId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await CarNameModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Car names retrieved successfully",
      data: {
        carNames,
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

// Get single car name by ID
export const getCarNameById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const carName = await CarNameModel.findById(id).populate("brandId", "name");

    if (!carName) {
      throw new AppError("اسم السيارة غير موجود", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Car name retrieved successfully",
      data: { carName },
    });
  } catch (error) {
    next(error);
  }
};

// Create new car name
export const createCarName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createCarNameSchema.parse(req.body);

    // Check if brand exists
    const brand = await BrandModel.findById(validatedData.brandId);
    if (!brand) {
      throw new AppError("الماركة غير موجودة", 404);
    }

    // Check if car name with same name and brand already exists
    const existingCarName = await CarNameModel.findOne({
      name: validatedData.name.trim(),
      brandId: validatedData.brandId,
    });

    if (existingCarName) {
      throw new AppError("اسم السيارة موجود بالفعل لهذه الماركة", 409);
    }

    const carName = await CarNameModel.create({
      name: validatedData.name.trim(),
      brandId: validatedData.brandId,
    });

    const carNameWithBrand = await CarNameModel.findById(carName._id).populate("brandId", "name");

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة اسم السيارة بنجاح!",
      data: { carName: carNameWithBrand },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("اسم السيارة موجود بالفعل", 409));
    }
    next(error);
  }
};

// Update car name
export const updateCarName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateCarNameSchema.parse(req.body);

    const carName = await CarNameModel.findById(id);

    if (!carName) {
      throw new AppError("اسم السيارة غير موجود", 404);
    }

    // Check if brand exists (if brandId is being updated)
    if (validatedData.brandId) {
      const brand = await BrandModel.findById(validatedData.brandId);
      if (!brand) {
        throw new AppError("الماركة غير موجودة", 404);
      }
    }

    // Check if car name with same name and brand already exists (if name or brandId is being updated)
    if (validatedData.name || validatedData.brandId) {
      const nameToCheck = validatedData.name?.trim() || carName.name;
      const brandIdToCheck = validatedData.brandId || carName.brandId.toString();

      const existingCarName = await CarNameModel.findOne({
        name: nameToCheck,
        brandId: brandIdToCheck,
        _id: { $ne: id },
      });

      if (existingCarName) {
        throw new AppError("اسم السيارة موجود بالفعل لهذه الماركة", 409);
      }
    }

    // Update car name
    Object.assign(carName, {
      ...(validatedData.name && { name: validatedData.name.trim() }),
      ...(validatedData.brandId && { brandId: validatedData.brandId }),
    });

    await carName.save();

    const updatedCarName = await CarNameModel.findById(id).populate("brandId", "name");

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث اسم السيارة بنجاح!",
      data: { carName: updatedCarName },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("اسم السيارة موجود بالفعل", 409));
    }
    next(error);
  }
};

// Delete car name
export const deleteCarName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const carName = await CarNameModel.findById(id);

    if (!carName) {
      throw new AppError("اسم السيارة غير موجود", 404);
    }

    await CarNameModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف اسم السيارة بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

