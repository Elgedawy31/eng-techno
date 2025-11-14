import type { Request, Response, NextFunction } from "express";
import { AboutPageContentModel } from "../models/aboutPageContent.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, processFileUpload } from "../utils/upload";

export const getAboutPageContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const content = await AboutPageContentModel.findOne({ isActive: true });

    if (!content) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active about page content found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "About page content retrieved successfully",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutPageContentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const content = await AboutPageContentModel.findById(id);

    if (!content) {
      throw new AppError("About page content not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "About page content retrieved successfully",
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAboutPageContents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contents = await AboutPageContentModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "About page contents retrieved successfully",
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateAboutPageContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      headline,
      description,
      secondDescription,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;

    if (!headline || !description || !secondDescription || !buttonText) {
      throw new AppError(
        "Headline, description, secondDescription, and buttonText are required",
        400
      );
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let backgroundPath: string | undefined;
    let logoPath: string | undefined;
    let profilePath: string | undefined;

    if (files) {
      // Handle backgroundImage
      if (files.backgroundImage && files.backgroundImage.length > 0) {
        const imageUrl = await processFileUpload(files.backgroundImage[0], "about-page-content", "background");
        if (!imageUrl) {
          throw new AppError("Failed to upload background image", 500);
        }
        backgroundPath = imageUrl;
      }

      // Handle logoImage
      if (files.logoImage && files.logoImage.length > 0) {
        const imageUrl = await processFileUpload(files.logoImage[0], "about-page-content", "logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload logo image", 500);
        }
        logoPath = imageUrl;
      }

      // Handle companyProfileFile (PDF)
      if (files.companyProfileFile && files.companyProfileFile.length > 0) {
        const fileUrl = await processFileUpload(files.companyProfileFile[0], "about-page-content", "company-profile", "raw");
        if (!fileUrl) {
          throw new AppError("Failed to upload company profile file", 500);
        }
        profilePath = fileUrl;
      }
    }

    if (!backgroundPath) {
      throw new AppError("Background image is required", 400);
    }

    // Check if content already exists (singleton pattern)
    const existingContent = await AboutPageContentModel.findOne();

    if (existingContent) {
      // Delete old files if new ones are uploaded
      if (backgroundPath && existingContent.backgroundImage) {
        try {
          await deleteFile(existingContent.backgroundImage);
        } catch (error) {
          console.error("Error deleting old background:", error);
        }
      }
      if (logoPath && existingContent.logoImage) {
        try {
          await deleteFile(existingContent.logoImage);
        } catch (error) {
          console.error("Error deleting old logo:", error);
        }
      }
      if (profilePath && existingContent.companyProfileFile) {
        try {
          await deleteFile(existingContent.companyProfileFile);
        } catch (error) {
          console.error("Error deleting old profile file:", error);
        }
      }

      // Update existing content
      existingContent.headline = headline;
      existingContent.description = description;
      existingContent.secondDescription = secondDescription;
      existingContent.backgroundImage = backgroundPath;
      if (logoPath) existingContent.logoImage = logoPath;
      if (profilePath) existingContent.companyProfileFile = profilePath;
      existingContent.buttonText = buttonText;
      if (buttonAction !== undefined) existingContent.buttonAction = buttonAction;
      if (isActive !== undefined) {
        existingContent.isActive = isActive === "true" || isActive === true;
      }

      await existingContent.save();

      return sendResponse(res, 200, {
        success: true,
        message: "About page content updated successfully",
        data: existingContent,
      });
    } else {
      // Create new content
      const content = await AboutPageContentModel.create({
        headline,
        description,
        secondDescription,
        backgroundImage: backgroundPath,
        logoImage: logoPath,
        companyProfileFile: profilePath,
        buttonText,
        buttonAction: buttonAction || undefined,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "About page content created successfully",
        data: content,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAboutPageContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      headline,
      description,
      secondDescription,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const content = await AboutPageContentModel.findById(id);

    if (!content) {
      throw new AppError("About page content not found", 404);
    }

    // Handle file uploads
    if (files) {
      // Handle backgroundImage
      if (files.backgroundImage && files.backgroundImage.length > 0) {
        if (content.backgroundImage) {
          try {
            await deleteFile(content.backgroundImage);
          } catch (error) {
            console.error("Error deleting old background:", error);
          }
        }
        const imageUrl = await processFileUpload(files.backgroundImage[0], "about-page-content", "background");
        if (!imageUrl) {
          throw new AppError("Failed to upload background image", 500);
        }
        content.backgroundImage = imageUrl;
      }

      // Handle logoImage
      if (files.logoImage && files.logoImage.length > 0) {
        if (content.logoImage) {
          try {
            await deleteFile(content.logoImage);
          } catch (error) {
            console.error("Error deleting old logo:", error);
          }
        }
        const imageUrl = await processFileUpload(files.logoImage[0], "about-page-content", "logo");
        if (!imageUrl) {
          throw new AppError("Failed to upload logo image", 500);
        }
        content.logoImage = imageUrl;
      }

      // Handle companyProfileFile (PDF)
      if (files.companyProfileFile && files.companyProfileFile.length > 0) {
        if (content.companyProfileFile) {
          try {
            await deleteFile(content.companyProfileFile);
          } catch (error) {
            console.error("Error deleting old profile file:", error);
          }
        }
        const fileUrl = await processFileUpload(files.companyProfileFile[0], "about-page-content", "company-profile", "raw");
        if (!fileUrl) {
          throw new AppError("Failed to upload company profile file", 500);
        }
        content.companyProfileFile = fileUrl;
      }
    }

    // Update other fields if provided
    if (headline) content.headline = headline;
    if (description) content.description = description;
    if (secondDescription) content.secondDescription = secondDescription;
    if (buttonText) content.buttonText = buttonText;
    if (buttonAction !== undefined) content.buttonAction = buttonAction;
    if (isActive !== undefined) {
      content.isActive = isActive === "true" || isActive === true;
    }

    await content.save();

    sendResponse(res, 200, {
      success: true,
      message: "About page content updated successfully",
      data: content,
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

    const content = await AboutPageContentModel.findById(id);

    if (!content) {
      throw new AppError("About page content not found", 404);
    }

    content.isActive = !content.isActive;
    await content.save();

    sendResponse(res, 200, {
      success: true,
      message: `About page content ${content.isActive ? "activated" : "deactivated"} successfully`,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAboutPageContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const content = await AboutPageContentModel.findById(id);

    if (!content) {
      throw new AppError("About page content not found", 404);
    }

    // Delete associated files
    const deletePromises: Promise<void>[] = [];

    if (content.backgroundImage) {
      deletePromises.push(deleteFile(content.backgroundImage).catch((err) => console.error("Error deleting background:", err)));
    }

    if (content.logoImage) {
      deletePromises.push(deleteFile(content.logoImage).catch((err) => console.error("Error deleting logo:", err)));
    }

    if (content.companyProfileFile) {
      deletePromises.push(deleteFile(content.companyProfileFile).catch((err) => console.error("Error deleting profile file:", err)));
    }

    await Promise.all(deletePromises);
    await AboutPageContentModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "About page content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

