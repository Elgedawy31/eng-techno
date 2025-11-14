import type { Request, Response, NextFunction } from "express";
import { MediaCentreModel } from "../models/mediaCentre.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";

export const getMediaCentre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mediaCentre = await MediaCentreModel.findOne({ isActive: true });

    if (!mediaCentre) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active media centre section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Media centre section retrieved successfully",
      data: mediaCentre,
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaCentreById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const mediaCentre = await MediaCentreModel.findById(id);

    if (!mediaCentre) {
      throw new AppError("Media centre section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Media centre section retrieved successfully",
      data: mediaCentre,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMediaCentres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mediaCentres = await MediaCentreModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Media centre sections retrieved successfully",
      data: mediaCentres,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateMediaCentre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mainTitle, mainDescription, isActive } = req.body;

    if (!mainTitle || !mainDescription) {
      throw new AppError("Main title and main description are required", 400);
    }

    // Check if media centre already exists (singleton pattern)
    const existingMediaCentre = await MediaCentreModel.findOne();

    if (existingMediaCentre) {
      // Update existing media centre
      existingMediaCentre.mainTitle = mainTitle;
      existingMediaCentre.mainDescription = mainDescription;
      if (isActive !== undefined) {
        existingMediaCentre.isActive = isActive === "true" || isActive === true;
      }

      await existingMediaCentre.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Media centre section updated successfully",
        data: existingMediaCentre,
      });
    } else {
      // Create new media centre
      const mediaCentre = await MediaCentreModel.create({
        mainTitle,
        mainDescription,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Media centre section created successfully",
        data: mediaCentre,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMediaCentre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { mainTitle, mainDescription, isActive } = req.body;

    const mediaCentre = await MediaCentreModel.findById(id);

    if (!mediaCentre) {
      throw new AppError("Media centre section not found", 404);
    }

    // Update fields if provided
    if (mainTitle) mediaCentre.mainTitle = mainTitle;
    if (mainDescription) mediaCentre.mainDescription = mainDescription;
    if (isActive !== undefined) {
      mediaCentre.isActive = isActive === "true" || isActive === true;
    }

    await mediaCentre.save();

    sendResponse(res, 200, {
      success: true,
      message: "Media centre section updated successfully",
      data: mediaCentre,
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

    const mediaCentre = await MediaCentreModel.findById(id);

    if (!mediaCentre) {
      throw new AppError("Media centre section not found", 404);
    }

    mediaCentre.isActive = !mediaCentre.isActive;
    await mediaCentre.save();

    sendResponse(res, 200, {
      success: true,
      message: `Media centre section ${mediaCentre.isActive ? "activated" : "deactivated"} successfully`,
      data: mediaCentre,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaCentre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const mediaCentre = await MediaCentreModel.findById(id);

    if (!mediaCentre) {
      throw new AppError("Media centre section not found", 404);
    }

    await MediaCentreModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Media centre section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

