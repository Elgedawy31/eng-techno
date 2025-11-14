import type { Request, Response, NextFunction } from "express";
import { EventModel } from "../models/event.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await EventModel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await EventModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      shortDescription,
      eventDateText,
      detailsButtonText,
      detailsButtonAction,
      displayImages,
      order,
      isActive,
    } = req.body;

    if (!title || !shortDescription || !detailsButtonText || !detailsButtonAction) {
      throw new AppError(
        "Title, shortDescription, detailsButtonText, and detailsButtonAction are required",
        400
      );
    }

    const files = req.files as Express.Multer.File[];
    let logoPath: string | undefined;
    const displayImagePaths: string[] = [];

    if (files && files.length > 0) {
      files.forEach((file) => {
        const relativePath = getRelativePath(file.path);
        const imagePath = `/uploads/${relativePath}`;

        if (file.fieldname === "eventLogoImage") {
          logoPath = imagePath;
        } else if (file.fieldname === "displayImages") {
          displayImagePaths.push(imagePath);
        }
      });
    }

    // Parse displayImages if provided as string/JSON
    let parsedDisplayImages: string[] = displayImagePaths;
    if (displayImages && displayImagePaths.length === 0) {
      if (typeof displayImages === "string") {
        try {
          parsedDisplayImages = JSON.parse(displayImages);
        } catch {
          parsedDisplayImages = displayImages.split(",").map((img: string) => img.trim()).filter(Boolean);
        }
      } else if (Array.isArray(displayImages)) {
        parsedDisplayImages = displayImages;
      }
    }

    const event = await EventModel.create({
      title,
      shortDescription,
      eventLogoImage: logoPath,
      eventDateText: eventDateText || undefined,
      detailsButtonText,
      detailsButtonAction,
      displayImages: parsedDisplayImages,
      order: order ? parseInt(order) : 0,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      shortDescription,
      eventDateText,
      detailsButtonText,
      detailsButtonAction,
      displayImages,
      order,
      isActive,
    } = req.body;
    const files = req.files as Express.Multer.File[];

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Handle file uploads
    if (files && files.length > 0) {
      files.forEach((file) => {
        const relativePath = getRelativePath(file.path);
        const imagePath = `/uploads/${relativePath}`;

        if (file.fieldname === "eventLogoImage") {
          // Delete old logo if exists
          if (event.eventLogoImage) {
            const oldLogoPath = event.eventLogoImage.replace("/uploads/", "uploads/");
            deleteFile(oldLogoPath).catch((err) => console.error("Error deleting old logo:", err));
          }
          event.eventLogoImage = imagePath;
        } else if (file.fieldname === "displayImages") {
          // Add new display images
          if (!event.displayImages) {
            event.displayImages = [];
          }
          event.displayImages.push(imagePath);
        }
      });
    }

    // Update other fields if provided
    if (title) event.title = title;
    if (shortDescription) event.shortDescription = shortDescription;
    if (eventDateText !== undefined) event.eventDateText = eventDateText || undefined;
    if (detailsButtonText) event.detailsButtonText = detailsButtonText;
    if (detailsButtonAction) event.detailsButtonAction = detailsButtonAction;
    if (displayImages !== undefined && (!files || files.filter(f => f.fieldname === "displayImages").length === 0)) {
      let parsedDisplayImages: string[] = [];
      if (typeof displayImages === "string") {
        try {
          parsedDisplayImages = JSON.parse(displayImages);
        } catch {
          parsedDisplayImages = displayImages.split(",").map((img: string) => img.trim()).filter(Boolean);
        }
      } else if (Array.isArray(displayImages)) {
        parsedDisplayImages = displayImages;
      }
      event.displayImages = parsedDisplayImages;
    }
    if (order !== undefined) event.order = parseInt(order);
    if (isActive !== undefined) {
      event.isActive = isActive === "true" || isActive === true;
    }

    await event.save();

    sendResponse(res, 200, {
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEventImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;

    if (!imagePath) {
      throw new AppError("Image path is required", 400);
    }

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Remove image from displayImages array
    if (event.displayImages) {
      event.displayImages = event.displayImages.filter((img) => img !== imagePath);
      await event.save();
    }

    // Delete the file
    const filePath = imagePath.replace("/uploads/", "uploads/");
    try {
      await deleteFile(filePath);
    } catch (error) {
      console.error("Error deleting image file:", error);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Event image deleted successfully",
      data: event,
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

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    event.isActive = !event.isActive;
    await event.save();

    sendResponse(res, 200, {
      success: true,
      message: `Event ${event.isActive ? "activated" : "deactivated"} successfully`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Delete associated images
    const deletePromises: Promise<void>[] = [];

    if (event.eventLogoImage) {
      const logoPath = event.eventLogoImage.replace("/uploads/", "uploads/");
      deletePromises.push(deleteFile(logoPath).catch((err) => console.error("Error deleting logo:", err)));
    }

    if (event.displayImages && event.displayImages.length > 0) {
      event.displayImages.forEach((imagePath) => {
        const filePath = imagePath.replace("/uploads/", "uploads/");
        deletePromises.push(deleteFile(filePath).catch((err) => console.error("Error deleting image:", err)));
      });
    }

    await Promise.all(deletePromises);
    await EventModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reorderEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { events } = req.body; // Array of { id, order }

    if (!Array.isArray(events)) {
      throw new AppError("Events array is required", 400);
    }

    // Update each event's order
    const updatePromises = events.map((item: { id: string; order: number }) =>
      EventModel.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedEvents = await EventModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Events reordered successfully",
      data: updatedEvents,
    });
  } catch (error) {
    next(error);
  }
};

