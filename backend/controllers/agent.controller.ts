import type { Request, Response, NextFunction } from "express";
import { AgentModel } from "../models/agent.model";
import { BrandModel } from "../models/brand.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { z, ZodError } from "zod";

// Validation schemas
const createAgentSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف"),
  brandId: z.string().min(1, "معرف الماركة مطلوب"),
});

const updateAgentSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(255, "الاسم يجب أن يكون أقل من 255 حرف").optional(),
  brandId: z.string().min(1, "معرف الماركة مطلوب").optional(),
});

// Get all agents
export const getAllAgents = async (
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

    const agents = await AgentModel.find(filter)
      .populate("brandId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await AgentModel.countDocuments(filter);

    sendResponse(res, 200, {
      success: true,
      message: "Agents retrieved successfully",
      data: {
        agents,
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

// Get single agent by ID
export const getAgentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const agent = await AgentModel.findById(id).populate("brandId", "name");

    if (!agent) {
      throw new AppError("الوكيل غير موجود", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Agent retrieved successfully",
      data: { agent },
    });
  } catch (error) {
    next(error);
  }
};

// Create new agent
export const createAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createAgentSchema.parse(req.body);

    // Check if brand exists
    const brand = await BrandModel.findById(validatedData.brandId);
    if (!brand) {
      throw new AppError("الماركة غير موجودة", 404);
    }

    // Check if agent with same name and brand already exists
    const existingAgent = await AgentModel.findOne({
      name: validatedData.name.trim(),
      brandId: validatedData.brandId,
    });

    if (existingAgent) {
      throw new AppError("الوكيل موجود بالفعل لهذه الماركة", 409);
    }

    const agent = await AgentModel.create({
      name: validatedData.name.trim(),
      brandId: validatedData.brandId,
    });

    const agentWithBrand = await AgentModel.findById(agent._id).populate("brandId", "name");

    sendResponse(res, 201, {
      success: true,
      message: "تم إضافة الوكيل بنجاح!",
      data: { agent: agentWithBrand },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الوكيل موجود بالفعل", 409));
    }
    next(error);
  }
};

// Update agent
export const updateAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const validatedData = updateAgentSchema.parse(req.body);

    const agent = await AgentModel.findById(id);

    if (!agent) {
      throw new AppError("الوكيل غير موجود", 404);
    }

    // Check if brand exists (if brandId is being updated)
    if (validatedData.brandId) {
      const brand = await BrandModel.findById(validatedData.brandId);
      if (!brand) {
        throw new AppError("الماركة غير موجودة", 404);
      }
    }

    // Check if agent with same name and brand already exists (if name or brandId is being updated)
    if (validatedData.name || validatedData.brandId) {
      const nameToCheck = validatedData.name?.trim() || agent.name;
      const brandIdToCheck = validatedData.brandId || agent.brandId.toString();

      const existingAgent = await AgentModel.findOne({
        name: nameToCheck,
        brandId: brandIdToCheck,
        _id: { $ne: id },
      });

      if (existingAgent) {
        throw new AppError("الوكيل موجود بالفعل لهذه الماركة", 409);
      }
    }

    // Update agent
    Object.assign(agent, {
      ...(validatedData.name && { name: validatedData.name.trim() }),
      ...(validatedData.brandId && { brandId: validatedData.brandId }),
    });

    await agent.save();

    const updatedAgent = await AgentModel.findById(id).populate("brandId", "name");

    sendResponse(res, 200, {
      success: true,
      message: "تم تحديث الوكيل بنجاح!",
      data: { agent: updatedAgent },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError(error.issues[0]?.message || "Validation error", 400));
    }
    if (error instanceof AppError) {
      return next(error);
    }
    if ((error as any).code === 11000) {
      return next(new AppError("الوكيل موجود بالفعل", 409));
    }
    next(error);
  }
};

// Delete agent
export const deleteAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const agent = await AgentModel.findById(id);

    if (!agent) {
      throw new AppError("الوكيل غير موجود", 404);
    }

    await AgentModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "تم حذف الوكيل بنجاح!",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(error);
  }
};

