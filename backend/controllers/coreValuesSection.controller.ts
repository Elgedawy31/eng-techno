import type { Request, Response, NextFunction } from "express";
import { CoreValuesSectionModel } from "../models/coreValuesSection.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";

export const getCoreValuesSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const section = await CoreValuesSectionModel.findOne({ isActive: true });

    if (!section) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active core values section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Core values section retrieved successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoreValuesSectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const section = await CoreValuesSectionModel.findById(id);

    if (!section) {
      throw new AppError("Core values section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Core values section retrieved successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCoreValuesSections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await CoreValuesSectionModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Core values sections retrieved successfully",
      data: sections,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateCoreValuesSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { label, heading, isActive } = req.body;

    if (!heading) {
      throw new AppError("Heading is required", 400);
    }

    // Check if section already exists (singleton pattern)
    const existingSection = await CoreValuesSectionModel.findOne();

    if (existingSection) {
      // Update existing section
      if (label !== undefined) existingSection.label = label;
      existingSection.heading = heading;
      if (isActive !== undefined) {
        existingSection.isActive = isActive === "true" || isActive === true;
      }

      await existingSection.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Core values section updated successfully",
        data: existingSection,
      });
    } else {
      // Create new section
      const section = await CoreValuesSectionModel.create({
        label: label || "//CORE VALUES",
        heading,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Core values section created successfully",
        data: section,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateCoreValuesSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { label, heading, isActive } = req.body;

    const section = await CoreValuesSectionModel.findById(id);

    if (!section) {
      throw new AppError("Core values section not found", 404);
    }

    // Update fields if provided
    if (label !== undefined) section.label = label;
    if (heading) section.heading = heading;
    if (isActive !== undefined) {
      section.isActive = isActive === "true" || isActive === true;
    }

    await section.save();

    sendResponse(res, 200, {
      success: true,
      message: "Core values section updated successfully",
      data: section,
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

    const section = await CoreValuesSectionModel.findById(id);

    if (!section) {
      throw new AppError("Core values section not found", 404);
    }

    section.isActive = !section.isActive;
    await section.save();

    sendResponse(res, 200, {
      success: true,
      message: `Core values section ${section.isActive ? "activated" : "deactivated"} successfully`,
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoreValuesSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const section = await CoreValuesSectionModel.findById(id);

    if (!section) {
      throw new AppError("Core values section not found", 404);
    }

    await CoreValuesSectionModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Core values section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

