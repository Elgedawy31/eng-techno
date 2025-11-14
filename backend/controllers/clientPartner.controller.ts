import type { Request, Response, NextFunction } from "express";
import { ClientPartnerModel } from "../models/clientPartner.model";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../errors/AppError";
import { deleteFile, getRelativePath } from "../utils/upload";

export const getClientPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientPartners = await ClientPartnerModel.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Client partners retrieved successfully",
      data: clientPartners,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientPartnerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const clientPartner = await ClientPartnerModel.findById(id);

    if (!clientPartner) {
      throw new AppError("Client partner not found", 404);
    }

    sendResponse(res, 200, {
      success: true,
      message: "Client partner retrieved successfully",
      data: clientPartner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClientPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientPartners = await ClientPartnerModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Client partners retrieved successfully",
      data: clientPartners,
    });
  } catch (error) {
    next(error);
  }
};

export const createClientPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, order, isActive } = req.body;

    if (!name) {
      throw new AppError("Name is required", 400);
    }

    const file = req.file;
    let emblemPath: string | undefined;

    if (file) {
      const relativePath = getRelativePath(file.path);
      emblemPath = `/uploads/${relativePath}`;
    }

    const clientPartner = await ClientPartnerModel.create({
      name,
      description: description || undefined,
      emblemImage: emblemPath,
      order: order ? parseInt(order) : 0,
      isActive: isActive === "true" || isActive === true || isActive === undefined,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Client partner created successfully",
      data: clientPartner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClientPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, order, isActive } = req.body;
    const file = req.file;

    const clientPartner = await ClientPartnerModel.findById(id);

    if (!clientPartner) {
      throw new AppError("Client partner not found", 404);
    }

    // If new image is uploaded, delete old one
    if (file) {
      if (clientPartner.emblemImage) {
        const oldEmblemPath = clientPartner.emblemImage.replace("/uploads/", "uploads/");
        try {
          await deleteFile(oldEmblemPath);
        } catch (error) {
          console.error("Error deleting old emblem:", error);
        }
      }

      const relativePath = getRelativePath(file.path);
      clientPartner.emblemImage = `/uploads/${relativePath}`;
    }

    // Update other fields if provided
    if (name) clientPartner.name = name;
    if (description !== undefined) clientPartner.description = description || undefined;
    if (order !== undefined) clientPartner.order = parseInt(order);
    if (isActive !== undefined) {
      clientPartner.isActive = isActive === "true" || isActive === true;
    }

    await clientPartner.save();

    sendResponse(res, 200, {
      success: true,
      message: "Client partner updated successfully",
      data: clientPartner,
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

    const clientPartner = await ClientPartnerModel.findById(id);

    if (!clientPartner) {
      throw new AppError("Client partner not found", 404);
    }

    clientPartner.isActive = !clientPartner.isActive;
    await clientPartner.save();

    sendResponse(res, 200, {
      success: true,
      message: `Client partner ${clientPartner.isActive ? "activated" : "deactivated"} successfully`,
      data: clientPartner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClientPartner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const clientPartner = await ClientPartnerModel.findById(id);

    if (!clientPartner) {
      throw new AppError("Client partner not found", 404);
    }

    // Delete associated emblem
    if (clientPartner.emblemImage) {
      const emblemPath = clientPartner.emblemImage.replace("/uploads/", "uploads/");
      try {
        await deleteFile(emblemPath);
      } catch (error) {
        console.error("Error deleting emblem:", error);
      }
    }

    await ClientPartnerModel.findByIdAndDelete(id);

    sendResponse(res, 200, {
      success: true,
      message: "Client partner deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const reorderClientPartners = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clientPartners } = req.body; // Array of { id, order }

    if (!Array.isArray(clientPartners)) {
      throw new AppError("Client partners array is required", 400);
    }

    // Update each client partner's order
    const updatePromises = clientPartners.map((item: { id: string; order: number }) =>
      ClientPartnerModel.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedClientPartners = await ClientPartnerModel.find().sort({ order: 1, createdAt: 1 });

    sendResponse(res, 200, {
      success: true,
      message: "Client partners reordered successfully",
      data: updatedClientPartners,
    });
  } catch (error) {
    next(error);
  }
};

