import type { Request, Response, NextFunction } from "express";
import { MissionVisionModel } from "../models/missionVision.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, processFileUpload } from "../utils/upload";

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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let missionLogoPath: string | undefined;
    let missionImagePath: string | undefined;
    let visionLogoPath: string | undefined;
    let visionImagePath: string | undefined;

    if (files) {
      // Handle missionLogoImage
      if (files.missionLogoImage && files.missionLogoImage.length > 0) {
        const imageUrl = await processFileUpload(files.missionLogoImage[0], "mission-vision", "mission-logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload mission logo image", 500);
        }
        missionLogoPath = imageUrl;
      }

      // Handle missionImage
      if (files.missionImage && files.missionImage.length > 0) {
        const imageUrl = await processFileUpload(files.missionImage[0], "mission-vision", "mission");
        if (!imageUrl) {
          throw new AppError("Failed to upload mission image", 500);
        }
        missionImagePath = imageUrl;
      }

      // Handle visionLogoImage
      if (files.visionLogoImage && files.visionLogoImage.length > 0) {
        const imageUrl = await processFileUpload(files.visionLogoImage[0], "mission-vision", "vision-logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload vision logo image", 500);
        }
        visionLogoPath = imageUrl;
      }

      // Handle visionImage
      if (files.visionImage && files.visionImage.length > 0) {
        const imageUrl = await processFileUpload(files.visionImage[0], "mission-vision", "vision");
        if (!imageUrl) {
          throw new AppError("Failed to upload vision image", 500);
        }
        visionImagePath = imageUrl;
      }
    }

    // Check if mission vision already exists (singleton pattern)
    const existingMissionVision = await MissionVisionModel.findOne();

    if (existingMissionVision) {
      // Delete old files if new ones are uploaded
      if (missionLogoPath && existingMissionVision.missionLogoImage) {
        try {
          await deleteFile(existingMissionVision.missionLogoImage);
        } catch (error) {
          console.error("Error deleting old mission logo:", error);
        }
      }
      if (missionImagePath && existingMissionVision.missionImage) {
        try {
          await deleteFile(existingMissionVision.missionImage);
        } catch (error) {
          console.error("Error deleting old mission image:", error);
        }
      }
      if (visionLogoPath && existingMissionVision.visionLogoImage) {
        try {
          await deleteFile(existingMissionVision.visionLogoImage);
        } catch (error) {
          console.error("Error deleting old vision logo:", error);
        }
      }
      if (visionImagePath && existingMissionVision.visionImage) {
        try {
          await deleteFile(existingMissionVision.visionImage);
        } catch (error) {
          console.error("Error deleting old vision image:", error);
        }
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const missionVision = await MissionVisionModel.findById(id);

    if (!missionVision) {
      throw new AppError("Mission & vision not found", 404);
    }

    // Handle file uploads
    if (files) {
      // Handle missionLogoImage
      if (files.missionLogoImage && files.missionLogoImage.length > 0) {
        if (missionVision.missionLogoImage) {
          try {
            await deleteFile(missionVision.missionLogoImage);
          } catch (error) {
            console.error("Error deleting old mission logo:", error);
          }
        }
        const imageUrl = await processFileUpload(files.missionLogoImage[0], "mission-vision", "mission-logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload mission logo image", 500);
        }
        missionVision.missionLogoImage = imageUrl;
      }

      // Handle missionImage
      if (files.missionImage && files.missionImage.length > 0) {
        if (missionVision.missionImage) {
          try {
            await deleteFile(missionVision.missionImage);
          } catch (error) {
            console.error("Error deleting old mission image:", error);
          }
        }
        const imageUrl = await processFileUpload(files.missionImage[0], "mission-vision", "mission");
        if (!imageUrl) {
          throw new AppError("Failed to upload mission image", 500);
        }
        missionVision.missionImage = imageUrl;
      }

      // Handle visionLogoImage
      if (files.visionLogoImage && files.visionLogoImage.length > 0) {
        if (missionVision.visionLogoImage) {
          try {
            await deleteFile(missionVision.visionLogoImage);
          } catch (error) {
            console.error("Error deleting old vision logo:", error);
          }
        }
        const imageUrl = await processFileUpload(files.visionLogoImage[0], "mission-vision", "vision-logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload vision logo image", 500);
        }
        missionVision.visionLogoImage = imageUrl;
      }

      // Handle visionImage
      if (files.visionImage && files.visionImage.length > 0) {
        if (missionVision.visionImage) {
          try {
            await deleteFile(missionVision.visionImage);
          } catch (error) {
            console.error("Error deleting old vision image:", error);
          }
        }
        const imageUrl = await processFileUpload(files.visionImage[0], "mission-vision", "vision");
        if (!imageUrl) {
          throw new AppError("Failed to upload vision image", 500);
        }
        missionVision.visionImage = imageUrl;
      }
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
      deletePromises.push(deleteFile(missionVision.missionLogoImage).catch((err) => console.error("Error deleting mission logo:", err)));
    }

    if (missionVision.missionImage) {
      deletePromises.push(deleteFile(missionVision.missionImage).catch((err) => console.error("Error deleting mission image:", err)));
    }

    if (missionVision.visionLogoImage) {
      deletePromises.push(deleteFile(missionVision.visionLogoImage).catch((err) => console.error("Error deleting vision logo:", err)));
    }

    if (missionVision.visionImage) {
      deletePromises.push(deleteFile(missionVision.visionImage).catch((err) => console.error("Error deleting vision image:", err)));
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

