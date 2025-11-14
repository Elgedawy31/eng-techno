'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Event {
  _id: string;
  title: string;
  shortDescription: string;
  eventLogoImage?: string;
  eventDateText?: string;
  detailsButtonText: string;
  detailsButtonAction: string;
  displayImages: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetEventsResponse = ApiResponse<Event[]>;
export type GetEventByIdResponse = ApiResponse<Event>;

export interface CreateEventPayload {
  title: string;
  shortDescription: string;
  eventDateText?: string;
  detailsButtonText: string;
  detailsButtonAction: string;
  displayImages?: string[];
  order?: number;
  isActive?: boolean;
  eventLogoImage?: File;
  displayImagesFiles?: File[];
}

export interface UpdateEventPayload {
  title?: string;
  shortDescription?: string;
  eventDateText?: string;
  detailsButtonText?: string;
  detailsButtonAction?: string;
  displayImages?: string[];
  order?: number;
  isActive?: boolean;
  eventLogoImage?: File;
  displayImagesFiles?: File[];
}

export interface ReorderEventsPayload {
  events: Array<{ id: string; order: number }>;
}

export interface DeleteEventImagePayload {
  imagePath: string;
}

export type CreateEventResponse = ApiResponse<Event>;
export type UpdateEventResponse = ApiResponse<Event>;
export type DeleteEventResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Event>;
export type ReorderEventsResponse = ApiResponse<Event[]>;
export type DeleteEventImageResponse = ApiResponse<Event>;

class EventService {
  async getEvents(signal?: AbortSignal): Promise<GetEventsResponse> {
    try {
      const response = await clientAxios.get<GetEventsResponse>("/events", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllEvents(signal?: AbortSignal): Promise<GetEventsResponse> {
    try {
      const response = await clientAxios.get<GetEventsResponse>("/events/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getEventById(id: string): Promise<GetEventByIdResponse> {
    try {
      const response = await clientAxios.get<GetEventByIdResponse>(`/events/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createEvent(payload: CreateEventPayload): Promise<CreateEventResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("shortDescription", payload.shortDescription);
      formData.append("detailsButtonText", payload.detailsButtonText);
      formData.append("detailsButtonAction", payload.detailsButtonAction);
      
      if (payload.eventDateText) {
        formData.append("eventDateText", payload.eventDateText);
      }
      
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      
      if (payload.eventLogoImage) {
        formData.append("eventLogoImage", payload.eventLogoImage);
      }
      
      // Only send displayImages in body if no files are being uploaded
      if (payload.displayImages && payload.displayImages.length > 0 && (!payload.displayImagesFiles || payload.displayImagesFiles.length === 0)) {
        formData.append("displayImages", JSON.stringify(payload.displayImages));
      }
      
      // Send display images as files
      if (payload.displayImagesFiles && payload.displayImagesFiles.length > 0) {
        payload.displayImagesFiles.forEach((file) => {
          formData.append("displayImages", file);
        });
      }

      const response = await clientAxios.post<CreateEventResponse>(
        "/events",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateEvent(
    id: string,
    payload: UpdateEventPayload
  ): Promise<UpdateEventResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.shortDescription) {
        formData.append("shortDescription", payload.shortDescription);
      }
      if (payload.eventDateText !== undefined) {
        formData.append("eventDateText", payload.eventDateText || "");
      }
      if (payload.detailsButtonText) {
        formData.append("detailsButtonText", payload.detailsButtonText);
      }
      if (payload.detailsButtonAction) {
        formData.append("detailsButtonAction", payload.detailsButtonAction);
      }
      if (payload.displayImages !== undefined) {
        formData.append("displayImages", JSON.stringify(payload.displayImages));
      }
      if (payload.order !== undefined) {
        formData.append("order", payload.order.toString());
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.eventLogoImage) {
        formData.append("eventLogoImage", payload.eventLogoImage);
      }
      if (payload.displayImagesFiles && payload.displayImagesFiles.length > 0) {
        payload.displayImagesFiles.forEach((file) => {
          formData.append("displayImages", file);
        });
      }

      const response = await clientAxios.put<UpdateEventResponse>(
        `/events/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<DeleteEventResponse> {
    try {
      const response = await clientAxios.delete<DeleteEventResponse>(
        `/events/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteEventImage(id: string, imagePath: string): Promise<DeleteEventImageResponse> {
    try {
      const response = await clientAxios.delete<DeleteEventImageResponse>(
        `/events/${id}/image`,
        {
          data: { imagePath },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/events/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async reorderEvents(payload: ReorderEventsPayload): Promise<ReorderEventsResponse> {
    try {
      const response = await clientAxios.patch<ReorderEventsResponse>(
        "/events/reorder",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const eventService = new EventService();

