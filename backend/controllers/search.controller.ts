import type { Request, Response, NextFunction } from "express";
import { SearchModel } from "../models/search.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = await SearchModel.findOne({ isActive: true });

    if (!search) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active search section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Search section retrieved successfully",
      data: search,
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const search = await SearchModel.findById(id);

    if (!search) {
      throw new AppError("Search section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Search section retrieved successfully",
      data: search,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSearches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searches = await SearchModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Search sections retrieved successfully",
      data: searches,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      subtitle,
      placeholder,
      buttonText,
      isActive,
    } = req.body;

    if (!title || !subtitle || !placeholder || !buttonText) {
      throw new AppError(
        "Title, subtitle, placeholder, and buttonText are required",
        400
      );
    }

    const file = req.file;
    let logoPath: string | undefined;

    if (file) {
      const relativePath = getRelativePath(file.path);
      logoPath = `/uploads/${relativePath}`;
    }

    // Check if search already exists (singleton pattern)
    const existingSearch = await SearchModel.findOne();

    if (existingSearch) {
      // Delete old logo if new one is uploaded
      if (file && existingSearch.logoImage) {
        const oldLogoPath = existingSearch.logoImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldLogoPath);
        } catch (error) {
          console.error("Error deleting old logo:", error);
        }
      }

      // Update existing search
      existingSearch.title = title;
      existingSearch.subtitle = subtitle;
      existingSearch.placeholder = placeholder;
      existingSearch.buttonText = buttonText;
      if (logoPath) existingSearch.logoImage = logoPath;
      if (isActive !== undefined) {
        existingSearch.isActive = isActive === "true" || isActive === true;
      }

      await existingSearch.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Search section updated successfully",
        data: existingSearch,
      });
    } else {
      // Create new search
      const search = await SearchModel.create({
        title,
        subtitle,
        placeholder,
        buttonText,
        logoImage: logoPath,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Search section created successfully",
        data: search,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      placeholder,
      buttonText,
      isActive,
    } = req.body;
    const file = req.file;

    const search = await SearchModel.findById(id);

    if (!search) {
      throw new AppError("Search section not found", 404);
    }

    // If new logo is uploaded, delete old one
    if (file) {
      if (search.logoImage) {
        const oldLogoPath = search.logoImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldLogoPath);
        } catch (error) {
          console.error("Error deleting old logo:", error);
        }
      }

      const relativePath = getRelativePath(file.path);
      search.logoImage = `/uploads/${relativePath}`;
    }

    // Update other fields if provided
    if (title) search.title = title;
    if (subtitle) search.subtitle = subtitle;
    if (placeholder) search.placeholder = placeholder;
    if (buttonText) search.buttonText = buttonText;
    if (isActive !== undefined) {
      search.isActive = isActive === "true" || isActive === true;
    }

    await search.save();

    sendResponse(res, 200, {
      success: true,
      message: "Search section updated successfully",
      data: search,
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

    const search = await SearchModel.findById(id);

    if (!search) {
      throw new AppError("Search section not found", 404);
    }

    search.isActive = !search.isActive;
    await search.save();

    sendResponse(res, 200, {
      success: true,
      message: `Search section ${search.isActive ? "activated" : "deactivated"} successfully`,
      data: search,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const search = await SearchModel.findById(id);

    if (!search) {
      throw new AppError("Search section not found", 404);
    }

    // Delete associated logo
    if (search.logoImage) {
      const logoPath = search.logoImage.replace("/uploads/", "uploads/");
      try {
        await deleteFile(logoPath);
      } catch (error) {
        console.error("Error deleting logo:", error);
      }
    }

    await SearchModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Search section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

