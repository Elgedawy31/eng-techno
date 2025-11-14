import type { Request, Response, NextFunction } from "express";
import { ServiceModel } from "../models/service.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await ServiceModel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const service = await ServiceModel.findById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await ServiceModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Services retrieved successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      categoryTags,
      buttonText,
      buttonAction,
      additionalText,
      order,
      isActive,
    } = req.body;

    if (!title || !description || !buttonText || !buttonAction) {
      throw new AppError(
        "Title, description, buttonText, and buttonAction are required",
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

    // Parse categoryTags if it's a string
    let tags: string[] = [];
    if (categoryTags) {
      if (typeof categoryTags === "string") {
        try {
          tags = JSON.parse(categoryTags);
        } catch {
          // If not JSON, treat as comma-separated string
          tags = categoryTags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
        }
      } else if (Array.isArray(categoryTags)) {
        tags = categoryTags;
      }
    }

    const service = await ServiceModel.create({
      title,
      description,
      backgroundImage: imagePath,
      categoryTags: tags,
      buttonText,
      buttonAction,
      additionalText: additionalText || undefined,
      order: order ? parseInt(order) : 0,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      categoryTags,
      buttonText,
      buttonAction,
      additionalText,
      order,
      isActive,
    } = req.body;
    const file = req.file;

    const service = await ServiceModel.findById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // If new image is uploaded, delete old one
    if (file) {
      if (service.backgroundImage) {
        const oldImagePath = service.backgroundImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldImagePath);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      const relativePath = getRelativePath(file.path);
      service.backgroundImage = `/uploads/${relativePath}`;
    }

    // Update other fields if provided
    if (title) service.title = title;
    if (description) service.description = description;
    if (categoryTags !== undefined) {
      let tags: string[] = [];
      if (typeof categoryTags === "string") {
        try {
          tags = JSON.parse(categoryTags);
        } catch {
          tags = categoryTags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
        }
      } else if (Array.isArray(categoryTags)) {
        tags = categoryTags;
      }
      service.categoryTags = tags;
    }
    if (buttonText) service.buttonText = buttonText;
    if (buttonAction) service.buttonAction = buttonAction;
    if (additionalText !== undefined) service.additionalText = additionalText || undefined;
    if (order !== undefined) service.order = parseInt(order);
    if (isActive !== undefined) {
      service.isActive = isActive === "true" || isActive === true;
    }

    await service.save();

    sendResponse(res, 200, {
      success: true,
      message: "Service updated successfully",
      data: service,
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

    const service = await ServiceModel.findById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    service.isActive = !service.isActive;
    await service.save();

    sendResponse(res, 200, {
      success: true,
      message: `Service ${service.isActive ? "activated" : "deactivated"} successfully`,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const service = await ServiceModel.findById(id);

    if (!service) {
      throw new AppError("Service not found", 404);
    }

    // Delete associated image
    if (service.backgroundImage) {
      const imagePath = service.backgroundImage.replace("/uploads/", "uploads/");
      try {
        await deleteFile(imagePath);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    await ServiceModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reorderServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { services } = req.body; // Array of { id, order }

    if (!Array.isArray(services)) {
      throw new AppError("Services array is required", 400);
    }

    // Update each service's order
    const updatePromises = services.map((item: { id: string; order: number }) =>
      ServiceModel.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedServices = await ServiceModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Services reordered successfully",
      data: updatedServices,
    });
  } catch (error) {
    next(error);
  }
};

