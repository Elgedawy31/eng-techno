import type { Request, Response, NextFunction } from "express";
import { CoreValueModel } from "../models/coreValue.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";

export const getCoreValues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coreValues = await CoreValueModel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Core values retrieved successfully",
      data: coreValues,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoreValueById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const coreValue = await CoreValueModel.findById(id);

    if (!coreValue) {
      throw new AppError("Core value not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Core value retrieved successfully",
      data: coreValue,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoreValues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const coreValues = await CoreValueModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Core values retrieved successfully",
      data: coreValues,
    });
  } catch (error) {
    next(error);
  }
};

export const createCoreValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, order, isActive } = req.body;

    if (!title || !description) {
      throw new AppError("Title and description are required", 400);
    }

    const coreValue = await CoreValueModel.create({
      title,
      description,
      order: order ? parseInt(order) : 0,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Core value created successfully",
      data: coreValue,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoreValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, order, isActive } = req.body;

    const coreValue = await CoreValueModel.findById(id);

    if (!coreValue) {
      throw new AppError("Core value not found", 404);
    }

    // Update fields if provided
    if (title) coreValue.title = title;
    if (description) coreValue.description = description;
    if (order !== undefined) coreValue.order = parseInt(order);
    if (isActive !== undefined) {
      coreValue.isActive = isActive === "true" || isActive === true;
    }

    await coreValue.save();

    sendResponse(res, 200, {
      success: true,
      message: "Core value updated successfully",
      data: coreValue,
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

    const coreValue = await CoreValueModel.findById(id);

    if (!coreValue) {
      throw new AppError("Core value not found", 404);
    }

    coreValue.isActive = !coreValue.isActive;
    await coreValue.save();

    sendResponse(res, 200, {
      success: true,
      message: `Core value ${coreValue.isActive ? "activated" : "deactivated"} successfully`,
      data: coreValue,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoreValue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const coreValue = await CoreValueModel.findById(id);

    if (!coreValue) {
      throw new AppError("Core value not found", 404);
    }

    await CoreValueModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Core value deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reorderCoreValues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { coreValues } = req.body; // Array of { id, order }

    if (!Array.isArray(coreValues)) {
      throw new AppError("Core values array is required", 400);
    }

    // Update each core value's order
    const updatePromises = coreValues.map((item: { id: string; order: number }) =>
      CoreValueModel.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedCoreValues = await CoreValueModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Core values reordered successfully",
      data: updatedCoreValues,
    });
  } catch (error) {
    next(error);
  }
};

