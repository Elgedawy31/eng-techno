import type { Request, Response, NextFunction } from "express";
import { CarModel, CAR_STATUSES } from "../models/car.model";
import { BrandModel } from "../models/brand.model";
import { AgentModel } from "../models/agent.model";
import { CarNameModel } from "../models/carName.model";
import { GradeModel } from "../models/grade.model";
import { YearModel } from "../models/year.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";
import { deleteFile } from "../utils/upload";

// Helper to parse array from string or array
const arraySchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val.split(",").map((item: string) => item.trim()).filter(Boolean);
      }
    }
    return Array.isArray(val) ? val : [];
  },
  z.array(z.string()).optional()
);

// Chassis schema validation
const chassisSchema = z.object({
  number: z.string().min(1, "رقم الشاسيه مطلوب"),
  internalColor: z.string().trim().optional(),
  externalColor: z.string().trim().optional(),
  status: z.enum(CAR_STATUSES as unknown as [string, ...string[]]).default("available"),
  reservedBy: z.string().optional().nullable(),
  transmission: z.enum(["manual", "automatic"]).default("automatic"),
  priceCash: z.coerce.number().min(0, "السعر النقدي يجب أن يكون أكبر من أو يساوي 0"),
  priceFinance: z.coerce.number().min(0, "السعر بالتقسيط يجب أن يكون أكبر من أو يساوي 0"),
  engine_capacity: z.coerce.number().min(0).optional(),
  fuel_capacity: z.coerce.number().min(0).optional(),
  location: z.string().trim().max(255).optional(),
  seat_type: z.string().trim().max(255).optional(),
});

// Validation schemas
const createCarSchema = z.object({
  brandId: z.string().min(1, "معرف الماركة مطلوب"),
  agentId: z.string().optional(),
  carNameId: z.string().min(1, "معرف اسم السيارة مطلوب"),
  gradeId: z.string().min(1, "معرف الدرجة مطلوب"),
  yearId: z.string().min(1, "معرف السنة مطلوب"),
  chassis: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(chassisSchema).min(1, "يجب إدخال شاسيه واحد على الأقل")
  ),
  description: z.string().trim().optional(),
});

const updateCarSchema = z.object({
  brandId: z.string().min(1, "معرف الماركة مطلوب").optional(),
  agentId: z.string().min(1, "معرف الوكيل مطلوب").optional(),
  carNameId: z.string().min(1, "معرف اسم السيارة مطلوب").optional(),
  gradeId: z.string().min(1, "معرف الدرجة مطلوب").optional(),
  yearId: z.string().min(1, "معرف السنة مطلوب").optional(),
  chassis: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(chassisSchema).optional()
  ),
  description: z.string().trim().optional(),
  existingImagesToKeep: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return Array.isArray(val) ? val : [];
    },
    z.array(z.string()).optional()
  ),
});

export const getAllCars = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.brandId) filter.brandId = req.query.brandId;
    if (req.query.agentId) filter.agentId = req.query.agentId;
    if (req.query.carNameId) filter.carNameId = req.query.carNameId;
    if (req.query.gradeId) filter.gradeId = req.query.gradeId;
    if (req.query.yearId) filter.yearId = req.query.yearId;
    if (req.query.status) {
      // Filter by chassis status
      filter["chassis.status"] = req.query.status;
    }
    // Price filtering on chassis
    const priceCashMin = req.query.priceCashMin ? Number(req.query.priceCashMin) : undefined;
    const priceCashMax = req.query.priceCashMax ? Number(req.query.priceCashMax) : undefined;
    const priceFinanceMin = req.query.priceFinanceMin ? Number(req.query.priceFinanceMin) : undefined;
    const priceFinanceMax = req.query.priceFinanceMax ? Number(req.query.priceFinanceMax) : undefined;
    if (priceCashMin !== undefined || priceCashMax !== undefined) {
      filter["chassis.priceCash"] = {};
      if (priceCashMin !== undefined) filter["chassis.priceCash"].$gte = priceCashMin;
      if (priceCashMax !== undefined) filter["chassis.priceCash"].$lte = priceCashMax;
    }
    if (priceFinanceMin !== undefined || priceFinanceMax !== undefined) {
      filter["chassis.priceFinance"] = {};
      if (priceFinanceMin !== undefined) filter["chassis.priceFinance"].$gte = priceFinanceMin;
      if (priceFinanceMax !== undefined) filter["chassis.priceFinance"].$lte = priceFinanceMax;
    }

    const cars = await CarModel.find(filter)
      .populate("brandId", "name")
      .populate("agentId", "name")
      .populate("carNameId", "name")
      .populate("gradeId", "name")
      .populate("yearId", "value")
      .populate("chassis.reservedBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await CarModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Cars retrieved successfully",
      data: {
        cars,
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

// Get single car by ID
export const getCarById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const car = await CarModel.findById(id)
      .populate("brandId", "name")
      .populate("agentId", "name")
      .populate("carNameId", "name")
      .populate("gradeId", "name")
      .populate("yearId", "value")
      .populate("chassis.reservedBy", "name email");

    if (!car) {
      throw new AppError("السيارة غير موجودة", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Car retrieved successfully",
      data: { car },
    });
  } catch (error) {
    next(error);
  }
};

// Create new car
export const createCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createCarSchema.parse(req.body);
    const files = req.files as Express.Multer.File[] | undefined;

    // Validate all relationships exist
    const [brand, agent, carName, grade, year] = await Promise.all([
      BrandModel.findById(validatedData.brandId),
      validatedData.agentId ? AgentModel.findById(validatedData.agentId) : Promise.resolve(null),
      CarNameModel.findById(validatedData.carNameId),
      GradeModel.findById(validatedData.gradeId),
      YearModel.findById(validatedData.yearId),
    ]);

    if (!brand) throw new AppError("الماركة غير موجودة", 404);
    if (validatedData.agentId && !agent) throw new AppError("الوكيل غير موجود", 404);
    if (!carName) throw new AppError("اسم السيارة غير موجود", 404);
    if (!grade) throw new AppError("الدرجة غير موجودة", 404);
    if (!year) throw new AppError("السنة غير موجودة", 404);

    // Handle images
    const imagePaths: string[] = [];
    if (files && files.length > 0) {
      imagePaths.push(...files.map((file) => `/uploads/cars/${file.filename}`));
    }

    // Process chassis: convert reservedBy strings to ObjectId or null
    const processedChassis = validatedData.chassis.map((ch) => ({
      ...ch,
      reservedBy: ch.reservedBy && ch.reservedBy.trim() !== "" ? ch.reservedBy : null,
    }));

    const car = await CarModel.create({
      brandId: validatedData.brandId,
      agentId: validatedData.agentId,
      carNameId: validatedData.carNameId,
      gradeId: validatedData.gradeId,
      yearId: validatedData.yearId,
      chassis: processedChassis,
      images: imagePaths,
      description: validatedData.description,
    });

    const carWithRelations = await CarModel.findById(car._id)
      .populate("brandId", "name")
      .populate("agentId", "name")
      .populate("carNameId", "name")
      .populate("gradeId", "name")
      .populate("yearId", "value")
      .populate("chassis.reservedBy", "name email");

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة السيارة بنجاح!",
      data: { car: carWithRelations },
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await deleteFile(`/uploads/cars/${file.filename}`);
        } catch (err) {
          console.error("Failed to delete uploaded file:", err);
        }
      }
    }

    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

// Update car
export const updateCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateCarSchema.parse(req.body);
    const files = req.files as Express.Multer.File[] | undefined;

    const car = await CarModel.findById(id);

    if (!car) {
      throw new AppError("السيارة غير موجودة", 404);
    }

    // Validate relationships if they're being updated
    if (validatedData.brandId) {
      const brand = await BrandModel.findById(validatedData.brandId);
      if (!brand) throw new AppError("الماركة غير موجودة", 404);
    }
    if (validatedData.agentId) {
      const agent = await AgentModel.findById(validatedData.agentId);
      if (!agent) throw new AppError("الوكيل غير موجود", 404);
    }
    if (validatedData.carNameId) {
      const carName = await CarNameModel.findById(validatedData.carNameId);
      if (!carName) throw new AppError("اسم السيارة غير موجود", 404);
    }
    if (validatedData.gradeId) {
      const grade = await GradeModel.findById(validatedData.gradeId);
      if (!grade) throw new AppError("الدرجة غير موجودة", 404);
    }
    if (validatedData.yearId) {
      const year = await YearModel.findById(validatedData.yearId);
      if (!year) throw new AppError("السنة غير موجودة", 404);
    }

    // Handle image updates
    let imagePaths: string[] = [];
    
    // If existingImagesToKeep is provided, use it; otherwise keep all existing images
    if (validatedData.existingImagesToKeep !== undefined) {
      // Only keep the images specified in existingImagesToKeep
      imagePaths = validatedData.existingImagesToKeep;
      
      // Delete images that are not in the keep list
      const imagesToDelete = (car.images || []).filter(
        (img) => !validatedData.existingImagesToKeep!.includes(img)
      );
      
      for (const imageToDelete of imagesToDelete) {
        try {
          await deleteFile(imageToDelete);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }
    } else {
      // If existingImagesToKeep is not provided, keep all existing images
      imagePaths = car.images || [];
    }
    
    // Add new images if any
    if (files && files.length > 0) {
      const newImagePaths = files.map((file) => `/uploads/cars/${file.filename}`);
      imagePaths = [...imagePaths, ...newImagePaths];
    }

    // Process chassis if provided: convert reservedBy strings to ObjectId or null
    if (validatedData.chassis !== undefined) {
      const processedChassis = validatedData.chassis.map((ch) => ({
        ...ch,
        reservedBy: ch.reservedBy && ch.reservedBy.trim() !== "" ? ch.reservedBy : null,
      }));
      // Update chassis array directly
      car.chassis = processedChassis as any;
    }

    // Remove existingImagesToKeep from updateData as it's not a database field
    const { existingImagesToKeep, chassis, ...dataToUpdate } = validatedData;
    const updateData: any = {
      ...dataToUpdate,
      // Always update images array if we have new images or if existingImagesToKeep was provided
      ...((files && files.length > 0) || existingImagesToKeep !== undefined ? { images: imagePaths } : {}),
    };

    // Update car
    Object.assign(car, updateData);

    await car.save();

    const updatedCar = await CarModel.findById(id)
      .populate("brandId", "name")
      .populate("agentId", "name")
      .populate("carNameId", "name")
      .populate("gradeId", "name")
      .populate("yearId", "value")
      .populate("chassis.reservedBy", "name email");

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث السيارة بنجاح!",
      data: { car: updatedCar },
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await deleteFile(`/uploads/cars/${file.filename}`);
        } catch (err) {
          console.error("Failed to delete uploaded file:", err);
        }
      }
    }

    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

// Delete car
export const deleteCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const car = await CarModel.findById(id);

    if (!car) {
      throw new AppError("السيارة غير موجودة", 404);
    }

    // Delete associated images
    if (car.images && car.images.length > 0) {
      for (const image of car.images) {
        try {
          await deleteFile(image);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    }

    await CarModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف السيارة بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

