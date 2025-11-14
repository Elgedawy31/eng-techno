import type { Request, Response, NextFunction } from "express";
import { AnnouncementModel } from "../models/announcement.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, processFileUpload } from "../utils/upload";

export const getAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const announcements = await AnnouncementModel.find({ isActive: true })
      .sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const announcement = await AnnouncementModel.findById(id);

    if (!announcement) {
      throw new AppError("Announcement not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Announcement retrieved successfully",
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const announcements = await AnnouncementModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      tagline,
      description,
      eventDateText,
      boothInfo,
      isActive,
    } = req.body;

    if (!title || !description) {
      throw new AppError("Title and description are required", 400);
    }

    const file = req.file;
    let logoUrl: string | undefined;

    if (file) {
      // Upload logo to Cloudinary
      logoUrl = await processFileUpload(file, "announcement", "logo");
      if (!logoUrl) {
        throw new AppError("Failed to upload logo image", 500);
      }
    }

    const announcement = await AnnouncementModel.create({
      title,
      tagline: tagline || undefined,
      description,
      eventLogoImage: logoUrl,
      eventDateText: eventDateText || undefined,
      boothInfo: boothInfo || undefined,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      tagline,
      description,
      eventDateText,
      boothInfo,
      isActive,
    } = req.body;
    const file = req.file;

    const announcement = await AnnouncementModel.findById(id);

    if (!announcement) {
      throw new AppError("Announcement not found", 404);
    }

    // Handle file upload
    if (file) {
      // Delete old logo if exists
      if (announcement.eventLogoImage) {
        try {
          await deleteFile(announcement.eventLogoImage);
        } catch (err) {
          console.error("Error deleting old logo:", err);
        }
      }

      // Upload logo to Cloudinary
      const logoUrl = await processFileUpload(file, "announcement", "logo");
      if (!logoUrl) {
        throw new AppError("Failed to upload logo image", 500);
      }
      announcement.eventLogoImage = logoUrl;
    }

    // Update other fields if provided
    if (title) announcement.title = title;
    if (tagline !== undefined) announcement.tagline = tagline || undefined;
    if (description) announcement.description = description;
    if (eventDateText !== undefined) announcement.eventDateText = eventDateText || undefined;
    if (boothInfo !== undefined) announcement.boothInfo = boothInfo || undefined;
    if (isActive !== undefined) {
      announcement.isActive = isActive === "true" || isActive === true;
    }

    await announcement.save();

    sendResponse(res, 200, {
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
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

    const announcement = await AnnouncementModel.findById(id);

    if (!announcement) {
      throw new AppError("Announcement not found", 404);
    }

    announcement.isActive = !announcement.isActive;
    await announcement.save();

    sendResponse(res, 200, {
      success: true,
      message: `Announcement ${announcement.isActive ? "activated" : "deactivated"} successfully`,
      data: announcement,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const announcement = await AnnouncementModel.findById(id);

    if (!announcement) {
      throw new AppError("Announcement not found", 404);
    }

    // Delete associated images
    if (announcement.eventLogoImage) {
      try {
        await deleteFile(announcement.eventLogoImage);
      } catch (error) {
        console.error("Error deleting logo:", error);
      }
    }
    await AnnouncementModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


