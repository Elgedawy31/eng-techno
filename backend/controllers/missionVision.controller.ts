import type { Request, Response, NextFunction } from "express";
import { MissionVisionModel } from "../models/missionVision.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getMissionVision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const missionVision = await MissionVisionModel.findOne({ isActive: true });

    if (!missionVision) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active mission & vision found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Mission & vision retrieved successfully",
      data: missionVision,
    });
  } catch (error) {
    next(error);
  }
};

export const getMissionVisionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const missionVision = await MissionVisionModel.findById(id);

    if (!missionVision) {
      throw new AppError("Mission & vision not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Mission & vision retrieved successfully",
      data: missionVision,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMissionVisions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const missionVisions = await MissionVisionModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Mission & visions retrieved successfully",
      data: missionVisions,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateMissionVision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      missionTitle,
      missionDescription,
      visionTitle,
      visionDescription,
      isActive,
    } = req.body;

    if (!missionTitle || !missionDescription || !visionTitle || !visionDescription) {
      throw new AppError(
        "Mission title, mission description, vision title, and vision description are required",
        400
      );
    }

    const files = req.files as Express.Multer.File[];
    let missionLogoPath: string | undefined;
    let missionImagePath: string | undefined;
    let visionLogoPath: string | undefined;
    let visionImagePath: string | undefined;

    if (files && files.length > 0) {
      files.forEach((file) => {
        const relativePath = getRelativePath(file.path);
        const filePath = `/uploads/${relativePath}`;

        if (file.fieldname === "missionLogoImage") {
          missionLogoPath = filePath;
        } else if (file.fieldname === "missionImage") {
          missionImagePath = filePath;
        } else if (file.fieldname === "visionLogoImage") {
          visionLogoPath = filePath;
        } else if (file.fieldname === "visionImage") {
          visionImagePath = filePath;
        }
      });
    }

    // Check if mission vision already exists (singleton pattern)
    const existingMissionVision = await MissionVisionModel.findOne();

    if (existingMissionVision) {
      // Delete old files if new ones are uploaded
      if (missionLogoPath && existingMissionVision.missionLogoImage) {
        const oldPath = existingMissionVision.missionLogoImage.replace("/uploads/", "uploads/");
        deleteFile(oldPath).catch((err) => console.error("Error deleting old mission logo:", err));
      }
      if (missionImagePath && existingMissionVision.missionImage) {
        const oldPath = existingMissionVision.missionImage.replace("/uploads/", "uploads/");
        deleteFile(oldPath).catch((err) => console.error("Error deleting old mission image:", err));
      }
      if (visionLogoPath && existingMissionVision.visionLogoImage) {
        const oldPath = existingMissionVision.visionLogoImage.replace("/uploads/", "uploads/");
        deleteFile(oldPath).catch((err) => console.error("Error deleting old vision logo:", err));
      }
      if (visionImagePath && existingMissionVision.visionImage) {
        const oldPath = existingMissionVision.visionImage.replace("/uploads/", "uploads/");
        deleteFile(oldPath).catch((err) => console.error("Error deleting old vision image:", err));
      }

      // Update existing mission vision
      existingMissionVision.missionTitle = missionTitle;
      existingMissionVision.missionDescription = missionDescription;
      existingMissionVision.visionTitle = visionTitle;
      existingMissionVision.visionDescription = visionDescription;
      if (missionLogoPath) existingMissionVision.missionLogoImage = missionLogoPath;
      if (missionImagePath) existingMissionVision.missionImage = missionImagePath;
      if (visionLogoPath) existingMissionVision.visionLogoImage = visionLogoPath;
      if (visionImagePath) existingMissionVision.visionImage = visionImagePath;
      if (isActive !== undefined) {
        existingMissionVision.isActive = isActive === "true" || isActive === true;
      }

      await existingMissionVision.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Mission & vision updated successfully",
        data: existingMissionVision,
      });
    } else {
      // Create new mission vision
      const missionVision = await MissionVisionModel.create({
        missionTitle,
        missionDescription,
        visionTitle,
        visionDescription,
        missionLogoImage: missionLogoPath,
        missionImage: missionImagePath,
        visionLogoImage: visionLogoPath,
        visionImage: visionImagePath,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Mission & vision created successfully",
        data: missionVision,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMissionVision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      missionTitle,
      missionDescription,
      visionTitle,
      visionDescription,
      isActive,
    } = req.body;
    const files = req.files as Express.Multer.File[];

    const missionVision = await MissionVisionModel.findById(id);

    if (!missionVision) {
      throw new AppError("Mission & vision not found", 404);
    }

    // Handle file uploads
    if (files && files.length > 0) {
      files.forEach((file) => {
        const relativePath = getRelativePath(file.path);
        const filePath = `/uploads/${relativePath}`;

        if (file.fieldname === "missionLogoImage") {
          if (missionVision.missionLogoImage) {
            const oldPath = missionVision.missionLogoImage.replace("/uploads/", "uploads/");
            deleteFile(oldPath).catch((err) => console.error("Error deleting old mission logo:", err));
          }
          missionVision.missionLogoImage = filePath;
        } else if (file.fieldname === "missionImage") {
          if (missionVision.missionImage) {
            const oldPath = missionVision.missionImage.replace("/uploads/", "uploads/");
            deleteFile(oldPath).catch((err) => console.error("Error deleting old mission image:", err));
          }
          missionVision.missionImage = filePath;
        } else if (file.fieldname === "visionLogoImage") {
          if (missionVision.visionLogoImage) {
            const oldPath = missionVision.visionLogoImage.replace("/uploads/", "uploads/");
            deleteFile(oldPath).catch((err) => console.error("Error deleting old vision logo:", err));
          }
          missionVision.visionLogoImage = filePath;
        } else if (file.fieldname === "visionImage") {
          if (missionVision.visionImage) {
            const oldPath = missionVision.visionImage.replace("/uploads/", "uploads/");
            deleteFile(oldPath).catch((err) => console.error("Error deleting old vision image:", err));
          }
          missionVision.visionImage = filePath;
        }
      });
    }

    // Update other fields if provided
    if (missionTitle) missionVision.missionTitle = missionTitle;
    if (missionDescription) missionVision.missionDescription = missionDescription;
    if (visionTitle) missionVision.visionTitle = visionTitle;
    if (visionDescription) missionVision.visionDescription = visionDescription;
    if (isActive !== undefined) {
      missionVision.isActive = isActive === "true" || isActive === true;
    }

    await missionVision.save();

    sendResponse(res, 200, {
      success: true,
      message: "Mission & vision updated successfully",
      data: missionVision,
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

    const missionVision = await MissionVisionModel.findById(id);

    if (!missionVision) {
      throw new AppError("Mission & vision not found", 404);
    }

    missionVision.isActive = !missionVision.isActive;
    await missionVision.save();

    sendResponse(res, 200, {
      success: true,
      message: `Mission & vision ${missionVision.isActive ? "activated" : "deactivated"} successfully`,
      data: missionVision,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMissionVision = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const missionVision = await MissionVisionModel.findById(id);

    if (!missionVision) {
      throw new AppError("Mission & vision not found", 404);
    }

    // Delete associated images
    const deletePromises: Promise<void>[] = [];

    if (missionVision.missionLogoImage) {
      const path = missionVision.missionLogoImage.replace("/uploads/", "uploads/");
      deletePromises.push(deleteFile(path).catch((err) => console.error("Error deleting mission logo:", err)));
    }

    if (missionVision.missionImage) {
      const path = missionVision.missionImage.replace("/uploads/", "uploads/");
      deletePromises.push(deleteFile(path).catch((err) => console.error("Error deleting mission image:", err)));
    }

    if (missionVision.visionLogoImage) {
      const path = missionVision.visionLogoImage.replace("/uploads/", "uploads/");
      deletePromises.push(deleteFile(path).catch((err) => console.error("Error deleting vision logo:", err)));
    }

    if (missionVision.visionImage) {
      const path = missionVision.visionImage.replace("/uploads/", "uploads/");
      deletePromises.push(deleteFile(path).catch((err) => console.error("Error deleting vision image:", err)));
    }

    await Promise.all(deletePromises);
    await MissionVisionModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Mission & vision deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

