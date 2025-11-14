import type { Request, Response, NextFunction } from "express";
import { FooterModel } from "../models/footer.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";

export const getFooter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const footer = await FooterModel.findOne({ isActive: true });

    if (!footer) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active footer found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Footer retrieved successfully",
      data: footer,
    });
  } catch (error) {
    next(error);
  }
};

export const getFooterById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const footer = await FooterModel.findById(id);

    if (!footer) {
      throw new AppError("Footer not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Footer retrieved successfully",
      data: footer,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFooters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const footers = await FooterModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Footers retrieved successfully",
      data: footers,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateFooter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      mainTitle,
      subtitle,
      email,
      phone,
      officeLocations,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;

    if (!mainTitle || !subtitle || !email || !phone || !officeLocations || !buttonText) {
      throw new AppError(
        "Main title, subtitle, email, phone, officeLocations, and buttonText are required",
        400
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    // Check if footer already exists (singleton pattern)
    const existingFooter = await FooterModel.findOne();

    if (existingFooter) {
      // Update existing footer
      existingFooter.mainTitle = mainTitle;
      existingFooter.subtitle = subtitle;
      existingFooter.email = email;
      existingFooter.phone = phone;
      existingFooter.officeLocations = officeLocations;
      existingFooter.buttonText = buttonText;
      if (buttonAction !== undefined) existingFooter.buttonAction = buttonAction;
      if (isActive !== undefined) {
        existingFooter.isActive = isActive === "true" || isActive === true;
      }

      await existingFooter.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Footer updated successfully",
        data: existingFooter,
      });
    } else {
      // Create new footer
      const footer = await FooterModel.create({
        mainTitle,
        subtitle,
        email,
        phone,
        officeLocations,
        buttonText,
        buttonAction: buttonAction || undefined,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Footer created successfully",
        data: footer,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateFooter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      mainTitle,
      subtitle,
      email,
      phone,
      officeLocations,
      buttonText,
      buttonAction,
      isActive,
    } = req.body;

    const footer = await FooterModel.findById(id);

    if (!footer) {
      throw new AppError("Footer not found", 404);
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
      }
    }

    // Update fields if provided
    if (mainTitle) footer.mainTitle = mainTitle;
    if (subtitle) footer.subtitle = subtitle;
    if (email) footer.email = email;
    if (phone) footer.phone = phone;
    if (officeLocations) footer.officeLocations = officeLocations;
    if (buttonText) footer.buttonText = buttonText;
    if (buttonAction !== undefined) footer.buttonAction = buttonAction;
    if (isActive !== undefined) {
      footer.isActive = isActive === "true" || isActive === true;
    }

    await footer.save();

    sendResponse(res, 200, {
      success: true,
      message: "Footer updated successfully",
      data: footer,
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

    const footer = await FooterModel.findById(id);

    if (!footer) {
      throw new AppError("Footer not found", 404);
    }

    footer.isActive = !footer.isActive;
    await footer.save();

    sendResponse(res, 200, {
      success: true,
      message: `Footer ${footer.isActive ? "activated" : "deactivated"} successfully`,
      data: footer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFooter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const footer = await FooterModel.findById(id);

    if (!footer) {
      throw new AppError("Footer not found", 404);
    }

    await FooterModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

