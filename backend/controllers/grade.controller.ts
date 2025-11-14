import type { Request, Response, NextFunction } from "express";
import { GradeModel } from "../models/grade.model";
import { CarNameModel } from "../models/carName.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";

// Validation schemas
const createGradeSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف"),
  carNameId: z.string().min(1, "معرف اسم السيارة مطلوب"),
});

const updateGradeSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف").optional(),
  carNameId: z.string().min(1, "معرف اسم السيارة مطلوب").optional(),
});

// Get all grades
export const getAllGrades = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filter by carNameId if provided
    const filter: any = {};
    if (req.query.carNameId) {
      filter.carNameId = req.query.carNameId;
    }

    const grades = await GradeModel.find(filter)
      .populate("carNameId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await GradeModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Grades retrieved successfully",
      data: {
        grades,
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

// Get single grade by ID
export const getGradeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const grade = await GradeModel.findById(id).populate("carNameId", "name");

    if (!grade) {
      throw new AppError("الدرجة غير موجودة", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Grade retrieved successfully",
      data: { grade },
    });
  } catch (error) {
    next(error);
  }
};

// Create new grade
export const createGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createGradeSchema.parse(req.body);

    // Check if car name exists
    const carName = await CarNameModel.findById(validatedData.carNameId);
    if (!carName) {
      throw new AppError("اسم السيارة غير موجود", 404);
    }

    // Check if grade with same name and car name already exists
    const existingGrade = await GradeModel.findOne({
      name: validatedData.name.trim(),
      carNameId: validatedData.carNameId,
    });

    if (existingGrade) {
      throw new AppError("الدرجة موجودة بالفعل لهذا الاسم", 409);
    }

    const grade = await GradeModel.create({
      name: validatedData.name.trim(),
      carNameId: validatedData.carNameId,
    });

    const gradeWithCarName = await GradeModel.findById(grade._id).populate("carNameId", "name");

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة الدرجة بنجاح!",
      data: { grade: gradeWithCarName },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الدرجة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Update grade
export const updateGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateGradeSchema.parse(req.body);

    const grade = await GradeModel.findById(id);

    if (!grade) {
      throw new AppError("الدرجة غير موجودة", 404);
    }

    // Check if car name exists (if carNameId is being updated)
    if (validatedData.carNameId) {
      const carName = await CarNameModel.findById(validatedData.carNameId);
      if (!carName) {
        throw new AppError("اسم السيارة غير موجود", 404);
      }
    }

    // Check if grade with same name and car name already exists (if name or carNameId is being updated)
    if (validatedData.name || validatedData.carNameId) {
      const nameToCheck = validatedData.name?.trim() || grade.name;
      const carNameIdToCheck = validatedData.carNameId || grade.carNameId.toString();

      const existingGrade = await GradeModel.findOne({
        name: nameToCheck,
        carNameId: carNameIdToCheck,
        _id: { $ne: id },
      });

      if (existingGrade) {
        throw new AppError("الدرجة موجودة بالفعل لهذا الاسم", 409);
      }
    }

    // Update grade
    Object.assign(grade, {
      ...(validatedData.name && { name: validatedData.name.trim() }),
      ...(validatedData.carNameId && { carNameId: validatedData.carNameId }),
    });

    await grade.save();

    const updatedGrade = await GradeModel.findById(id).populate("carNameId", "name");

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث الدرجة بنجاح!",
      data: { grade: updatedGrade },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الدرجة موجودة بالفعل", 409));
    }
    next(error);
  }
};

// Delete grade
export const deleteGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const grade = await GradeModel.findById(id);

    if (!grade) {
      throw new AppError("الدرجة غير موجودة", 404);
    }

    await GradeModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف الدرجة بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

