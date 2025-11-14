import type { Request, Response, NextFunction } from "express";
import { ClientsPartnersSectionModel } from "../models/clientsPartnersSection.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";

export const getClientsPartnersSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const section = await ClientsPartnersSectionModel.findOne({ isActive: true });

    if (!section) {
      return sendResponse(res, 200, {
        success: true,
        message: "No active clients & partners section found",
        data: null,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Clients & partners section retrieved successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientsPartnersSectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const section = await ClientsPartnersSectionModel.findById(id);

    if (!section) {
      throw new AppError("Clients & partners section not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Clients & partners section retrieved successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClientsPartnersSections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sections = await ClientsPartnersSectionModel.find().sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      message: "Clients & partners sections retrieved successfully",
      data: sections,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateClientsPartnersSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, isActive } = req.body;

    if (!title || !description) {
      throw new AppError("Title and description are required", 400);
    }

    // Check if section already exists (singleton pattern)
    const existingSection = await ClientsPartnersSectionModel.findOne();

    if (existingSection) {
      // Update existing section
      existingSection.title = title;
      existingSection.description = description;
      if (isActive !== undefined) {
        existingSection.isActive = isActive === "true" || isActive === true;
      }

      await existingSection.save();

      return sendResponse(res, 200, {
        success: true,
        message: "Clients & partners section updated successfully",
        data: existingSection,
      });
    } else {
      // Create new section
      const section = await ClientsPartnersSectionModel.create({
        title,
        description,
        isActive: isActive === "true" || isActive === true || isActive === undefined,
      });

      sendResponse(res, 201, {
        success: true,
        message: "Clients & partners section created successfully",
        data: section,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateClientsPartnersSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const section = await ClientsPartnersSectionModel.findById(id);

    if (!section) {
      throw new AppError("Clients & partners section not found", 404);
    }

    // Update fields if provided
    if (title) section.title = title;
    if (description) section.description = description;
    if (isActive !== undefined) {
      section.isActive = isActive === "true" || isActive === true;
    }

    await section.save();

    sendResponse(res, 200, {
      success: true,
      message: "Clients & partners section updated successfully",
      data: section,
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

    const section = await ClientsPartnersSectionModel.findById(id);

    if (!section) {
      throw new AppError("Clients & partners section not found", 404);
    }

    section.isActive = !section.isActive;
    await section.save();

    sendResponse(res, 200, {
      success: true,
      message: `Clients & partners section ${section.isActive ? "activated" : "deactivated"} successfully`,
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClientsPartnersSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const section = await ClientsPartnersSectionModel.findById(id);

    if (!section) {
      throw new AppError("Clients & partners section not found", 404);
    }

    await ClientsPartnersSectionModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Clients & partners section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

