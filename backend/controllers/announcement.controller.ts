import type { Request, Response, NextFunction } from "express";
import { AnnouncementModel } from "../models/announcement.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

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
    let logoPath: string | undefined;

    if (file) {
      const relativePath = getRelativePath(file.path);
      logoPath = `/uploads/${relativePath}`;
    }

    const announcement = await AnnouncementModel.create({
      title,
      tagline: tagline || undefined,
      description,
      eventLogoImage: logoPath,
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
        const oldLogoPath = announcement.eventLogoImage.replace("/uploads/", "uploads/");
        deleteFile(oldLogoPath).catch((err) => console.error("Error deleting old logo:", err));
      }

      const relativePath = getRelativePath(file.path);
      announcement.eventLogoImage = `/uploads/${relativePath}`;
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
      const logoPath = announcement.eventLogoImage.replace("/uploads/", "uploads/");
      try {
        await deleteFile(logoPath);
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


