import type { Request, Response, NextFunction } from "express";
import { YearModel } from "../models/year.model";
import { GradeModel } from "../models/grade.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";

// Validation schemas
const createYearSchema = z.object({
  value: z.coerce.number().int("السنة يجب أن تكون رقماً صحيحاً").min(1900, "السنة يجب أن تكون أكبر من أو تساوي 1900").max(2100, "السنة يجب أن تكون أقل من أو تساوي 2100"),
  gradeId: z.string().min(1, "معرف الدرجة مطلوب"),
});

const updateYearSchema = z.object({
  value: z.coerce.number().int("السنة يجب أن تكون رقماً صحيحاً").min(1900, "السنة يجب أن تكون أكبر من أو تساوي 1900").max(2100, "السنة يجب أن تكون أقل من أو تساوي 2100").optional(),
  gradeId: z.string().min(1, "معرف الدرجة مطلوب").optional(),
});

// Get all years
export const getAllYears = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter by gradeId if provided
    const filter: any = {};
    if (req.query.gradeId) {
      filter.gradeId = req.query.gradeId;
    }

    const years = await YearModel.find(filter)
      .populate("gradeId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ value: -1 });

    const total = await YearModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Years retrieved successfully",
      data: {
        years,
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

// Get single year by ID
export const getYearById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const year = await YearModel.findById(id).populate("gradeId", "name");

    if (!year) {
      throw new AppError("السنة غير موجودة", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Year retrieved successfully",
      data: { year },
    });
  } catch (error) {
    next(error);
  }
};

// Create new year
export const createYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createYearSchema.parse(req.body);

    // Check if grade exists
    const grade = await GradeModel.findById(validatedData.gradeId);
    if (!grade) {
      throw new AppError("الدرجة غير موجودة", 404);
    }

    // Check if year with same value and grade already exists
    const existingYear = await YearModel.findOne({
      value: validatedData.value,
      gradeId: validatedData.gradeId,
    });

    if (existingYear) {
      throw new AppError("السنة موجودة بالفعل لهذه الدرجة", 409);
    }

    const year = await YearModel.create({
      value: validatedData.value,
      gradeId: validatedData.gradeId,
    });

    const yearWithGrade = await YearModel.findById(year._id).populate("gradeId", "name");

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة السنة بنجاح!",
      data: { year: yearWithGrade },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("السنة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Update year
export const updateYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateYearSchema.parse(req.body);

    const year = await YearModel.findById(id);

    if (!year) {
      throw new AppError("السنة غير موجودة", 404);
    }

    // Check if grade exists (if gradeId is being updated)
    if (validatedData.gradeId) {
      const grade = await GradeModel.findById(validatedData.gradeId);
      if (!grade) {
        throw new AppError("الدرجة غير موجودة", 404);
      }
    }

    // Check if year with same value and grade already exists (if value or gradeId is being updated)
    if (validatedData.value !== undefined || validatedData.gradeId) {
      const valueToCheck = validatedData.value !== undefined ? validatedData.value : year.value;
      const gradeIdToCheck = validatedData.gradeId || year.gradeId.toString();

      const existingYear = await YearModel.findOne({
        value: valueToCheck,
        gradeId: gradeIdToCheck,
        _id: { $ne: id },
      });

      if (existingYear) {
        throw new AppError("السنة موجودة بالفعل لهذه الدرجة", 409);
      }
    }

    // Update year
    Object.assign(year, {
      ...(validatedData.value !== undefined && { value: validatedData.value }),
      ...(validatedData.gradeId && { gradeId: validatedData.gradeId }),
    });

    await year.save();

    const updatedYear = await YearModel.findById(id).populate("gradeId", "name");

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث السنة بنجاح!",
      data: { year: updatedYear },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("السنة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Delete year
export const deleteYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const year = await YearModel.findById(id);

    if (!year) {
      throw new AppError("السنة غير موجودة", 404);
    }

    await YearModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف السنة بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

