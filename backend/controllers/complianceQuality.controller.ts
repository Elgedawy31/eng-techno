import type { Request, Response, NextFunction } from "express";
import { ComplianceQualityModel } from "../models/complianceQuality.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, processFileUpload } from "../utils/upload";

export const getComplianceQuality = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const complianceQuality = await ComplianceQualityModel.findOne({ isActive: true });

    if (!complianceQuality) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active compliance & quality section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Compliance & quality section retrieved successfully",
      data: complianceQuality,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplianceQualityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const complianceQuality = await ComplianceQualityModel.findById(id);

    if (!complianceQuality) {
      throw new AppError("Compliance & quality section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Compliance & quality section retrieved successfully",
      data: complianceQuality,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComplianceQualities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const complianceQualities = await ComplianceQualityModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Compliance & quality sections retrieved successfully",
      data: complianceQualities,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateComplianceQuality = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      firstDescription,
      secondDescription,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;

    if (!title || !firstDescription || !secondDescription || !buttonText) {
      throw new AppError(
        "Title, firstDescription, secondDescription, and buttonText are required",
        400
      );
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let logoPath: string | undefined;
    let displayPath: string | undefined;
    let profilePath: string | undefined;

    if (files) {
      // Handle logoImage
      if (files.logoImage && files.logoImage[0]) {
        const imageUrl = await processFileUpload(files.logoImage[0], "compliance-quality", "logo");
        if (imageUrl) {
          logoPath = imageUrl;
        }
      }

      // Handle displayImage
      if (files.displayImage && files.displayImage[0]) {
        const imageUrl = await processFileUpload(files.displayImage[0], "compliance-quality", "display");
        if (imageUrl) {
          displayPath = imageUrl;
        }
      }

      // Handle companyProfileFile (PDF)
      if (files.companyProfileFile && files.companyProfileFile[0]) {
        const fileUrl = await processFileUpload(files.companyProfileFile[0], "compliance-quality", "company-profile", "raw");
        if (fileUrl) {
          profilePath = fileUrl;
        }
      }
    }

    // Check if compliance quality already exists (singleton pattern)
    const existingComplianceQuality = await ComplianceQualityModel.findOne();

    if (existingComplianceQuality) {
      // Delete old files if new ones are uploaded
      if (logoPath && existingComplianceQuality.logoImage) {
        deleteFile(existingComplianceQuality.logoImage).catch((err) => console.error("Error deleting old logo:", err));
      }
      if (displayPath && existingComplianceQuality.displayImage) {
        deleteFile(existingComplianceQuality.displayImage).catch((err) => console.error("Error deleting old display image:", err));
      }
      if (profilePath && existingComplianceQuality.companyProfileFile) {
        deleteFile(existingComplianceQuality.companyProfileFile).catch((err) => console.error("Error deleting old profile file:", err));
      }

      // Update existing compliance quality
      existingComplianceQuality.title = title;
      existingComplianceQuality.firstDescription = firstDescription;
      existingComplianceQuality.secondDescription = secondDescription;
      if (logoPath) existingComplianceQuality.logoImage = logoPath;
      if (displayPath) existingComplianceQuality.displayImage = displayPath;
      if (profilePath) existingComplianceQuality.companyProfileFile = profilePath;
      existingComplianceQuality.buttonText = buttonText;
      if (buttonAction !== undefined) existingComplianceQuality.buttonAction = buttonAction;
      if (isActive !== undefined) {
        existingComplianceQuality.isActive = isActive === "true" || isActive === true;
      }

      await existingComplianceQuality.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Compliance & quality section updated successfully",
        data: existingComplianceQuality,
      });
    } else {
      // Create new compliance quality
      const complianceQuality = await ComplianceQualityModel.create({
        title,
        firstDescription,
        secondDescription,
        logoImage: logoPath,
        displayImage: displayPath,
        companyProfileFile: profilePath,
        buttonText,
        buttonAction: buttonAction || undefined,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Compliance & quality section created successfully",
        data: complianceQuality,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateComplianceQuality = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      firstDescription,
      secondDescription,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const complianceQuality = await ComplianceQualityModel.findById(id);

    if (!complianceQuality) {
      throw new AppError("Compliance & quality section not found", 404);
    }

    // Handle file uploads
    if (files) {
      // Handle logoImage
      if (files.logoImage && files.logoImage[0]) {
        if (complianceQuality.logoImage) {
          deleteFile(complianceQuality.logoImage).catch((err) => console.error("Error deleting old logo:", err));
        }
        const imageUrl = await processFileUpload(files.logoImage[0], "compliance-quality", "logo");
        if (imageUrl) {
          complianceQuality.logoImage = imageUrl;
        }
      }

      // Handle displayImage
      if (files.displayImage && files.displayImage[0]) {
        if (complianceQuality.displayImage) {
          deleteFile(complianceQuality.displayImage).catch((err) => console.error("Error deleting old display image:", err));
        }
        const imageUrl = await processFileUpload(files.displayImage[0], "compliance-quality", "display");
        if (imageUrl) {
          complianceQuality.displayImage = imageUrl;
        }
      }

      // Handle companyProfileFile (PDF)
      if (files.companyProfileFile && files.companyProfileFile[0]) {
        if (complianceQuality.companyProfileFile) {
          deleteFile(complianceQuality.companyProfileFile).catch((err) => console.error("Error deleting old profile file:", err));
        }
        const fileUrl = await processFileUpload(files.companyProfileFile[0], "compliance-quality", "company-profile", "raw");
        if (fileUrl) {
          complianceQuality.companyProfileFile = fileUrl;
        }
      }
    }

    // Update other fields if provided
    if (title) complianceQuality.title = title;
    if (firstDescription) complianceQuality.firstDescription = firstDescription;
    if (secondDescription) complianceQuality.secondDescription = secondDescription;
    if (buttonText) complianceQuality.buttonText = buttonText;
    if (buttonAction !== undefined) complianceQuality.buttonAction = buttonAction;
    if (isActive !== undefined) {
      complianceQuality.isActive = isActive === "true" || isActive === true;
    }

    await complianceQuality.save();

    sendResponse(res, 200, {
      success: true,
      message: "Compliance & quality section updated successfully",
      data: complianceQuality,
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

    const complianceQuality = await ComplianceQualityModel.findById(id);

    if (!complianceQuality) {
      throw new AppError("Compliance & quality section not found", 404);
    }

    complianceQuality.isActive = !complianceQuality.isActive;
    await complianceQuality.save();

    sendResponse(res, 200, {
      success: true,
      message: `Compliance & quality section ${complianceQuality.isActive ? "activated" : "deactivated"} successfully`,
      data: complianceQuality,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComplianceQuality = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const complianceQuality = await ComplianceQualityModel.findById(id);

    if (!complianceQuality) {
      throw new AppError("Compliance & quality section not found", 404);
    }

    // Delete associated files
    const deletePromises: Promise<void>[] = [];

    if (complianceQuality.logoImage) {
      deletePromises.push(deleteFile(complianceQuality.logoImage).catch((err) => console.error("Error deleting logo:", err)));
    }

    if (complianceQuality.displayImage) {
      deletePromises.push(deleteFile(complianceQuality.displayImage).catch((err) => console.error("Error deleting display image:", err)));
    }

    if (complianceQuality.companyProfileFile) {
      deletePromises.push(deleteFile(complianceQuality.companyProfileFile).catch((err) => console.error("Error deleting profile file:", err)));
    }

    await Promise.all(deletePromises);
    await ComplianceQualityModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Compliance & quality section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

