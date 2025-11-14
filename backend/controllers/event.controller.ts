import type { Request, Response, NextFunction } from "express";
import { EventModel } from "../models/event.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, processFileUpload } from "../utils/upload";

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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let logoUrl: string | undefined;
    const displayImageUrls: string[] = [];

    if (files) {
      // Handle logo image
      if (files.eventLogoImage && files.eventLogoImage.length > 0) {
        const logoFile = files.eventLogoImage[0];
        logoUrl = await processFileUpload(logoFile, "event", "logo");
        if (!logoUrl) {
          throw new AppError("Failed to upload logo image", 500);
        }
      }

      // Handle display images
      if (files.displayImages && files.displayImages.length > 0) {
        const uploadPromises = files.displayImages.map((file) =>
          processFileUpload(file, "event", "display")
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url): url is string => url !== undefined);
        displayImageUrls.push(...validUrls);
      }
    }

    // Parse displayImages if provided as string/JSON
    let parsedDisplayImages: string[] = displayImageUrls;
    if (displayImages && displayImageUrls.length === 0) {
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
      eventLogoImage: logoUrl,
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    const event = await EventModel.findById(id);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Handle file uploads
    if (files) {
      // Handle logo image
      if (files.eventLogoImage && files.eventLogoImage.length > 0) {
        // Delete old logo if exists
        if (event.eventLogoImage) {
          try {
            await deleteFile(event.eventLogoImage);
          } catch (err) {
            console.error("Error deleting old logo:", err);
          }
        }
        const logoFile = files.eventLogoImage[0];
        const logoUrl = await processFileUpload(logoFile, "event", "logo");
        if (!logoUrl) {
          throw new AppError("Failed to upload logo image", 500);
        }
        event.eventLogoImage = logoUrl;
      }

      // Handle display images
      if (files.displayImages && files.displayImages.length > 0) {
        if (!event.displayImages) {
          event.displayImages = [];
        }
        const uploadPromises = files.displayImages.map((file) =>
          processFileUpload(file, "event", "display")
        );
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url): url is string => url !== undefined);
        event.displayImages.push(...validUrls);
      }
    }

    // Update other fields if provided
    if (title) event.title = title;
    if (shortDescription) event.shortDescription = shortDescription;
    if (eventDateText !== undefined) event.eventDateText = eventDateText || undefined;
    if (detailsButtonText) event.detailsButtonText = detailsButtonText;
    if (detailsButtonAction) event.detailsButtonAction = detailsButtonAction;
    if (displayImages !== undefined && (!files || !files.displayImages || files.displayImages.length === 0)) {
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
    try {
      await deleteFile(imagePath);
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
      deletePromises.push(deleteFile(event.eventLogoImage).catch((err) => console.error("Error deleting logo:", err)));
    }

    if (event.displayImages && event.displayImages.length > 0) {
      event.displayImages.forEach((imagePath) => {
        deletePromises.push(deleteFile(imagePath).catch((err) => console.error("Error deleting image:", err)));
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

