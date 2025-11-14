'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
} from "@/types/api.types";

export interface Announcement {
  _id: string;
  title: string;
  tagline?: string;
  description: string;
  eventLogoImage?: string;
  eventDateText?: string;
  boothInfo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetAnnouncementsResponse = ApiResponse<Announcement[]>;
export type GetAnnouncementByIdResponse = ApiResponse<Announcement>;

export interface CreateAnnouncementPayload {
  title: string;
  tagline?: string;
  description: string;
  eventDateText?: string;
  boothInfo?: string;
  isActive?: boolean;
  eventLogoImage?: File;
}

export interface UpdateAnnouncementPayload {
  title?: string;
  tagline?: string;
  description?: string;
  eventDateText?: string;
  boothInfo?: string;
  isActive?: boolean;
  eventLogoImage?: File;
}

export type CreateAnnouncementResponse = ApiResponse<Announcement>;
export type UpdateAnnouncementResponse = ApiResponse<Announcement>;
export type DeleteAnnouncementResponse = ApiResponse<null>;
export type ToggleActiveResponse = ApiResponse<Announcement>;

class AnnouncementService {
  async getAnnouncements(signal?: AbortSignal): Promise<GetAnnouncementsResponse> {
    try {
      const response = await clientAxios.get<GetAnnouncementsResponse>("/announcements", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllAnnouncements(signal?: AbortSignal): Promise<GetAnnouncementsResponse> {
    try {
      const response = await clientAxios.get<GetAnnouncementsResponse>("/announcements/admin", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAnnouncementById(id: string): Promise<GetAnnouncementByIdResponse> {
    try {
      const response = await clientAxios.get<GetAnnouncementByIdResponse>(`/announcements/admin/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createAnnouncement(payload: CreateAnnouncementPayload): Promise<CreateAnnouncementResponse> {
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      
      if (payload.tagline) {
        formData.append("tagline", payload.tagline);
      }
      if (payload.eventDateText) {
        formData.append("eventDateText", payload.eventDateText);
      }
      if (payload.boothInfo) {
        formData.append("boothInfo", payload.boothInfo);
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.eventLogoImage) {
        formData.append("eventLogoImage", payload.eventLogoImage);
      }

      const response = await clientAxios.post<CreateAnnouncementResponse>(
        "/announcements",
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

  async updateAnnouncement(
    id: string,
    payload: UpdateAnnouncementPayload
  ): Promise<UpdateAnnouncementResponse> {
    try {
      const formData = new FormData();
      
      if (payload.title) {
        formData.append("title", payload.title);
      }
      if (payload.tagline !== undefined) {
        formData.append("tagline", payload.tagline || "");
      }
      if (payload.description) {
        formData.append("description", payload.description);
      }
      if (payload.eventDateText !== undefined) {
        formData.append("eventDateText", payload.eventDateText || "");
      }
      if (payload.boothInfo !== undefined) {
        formData.append("boothInfo", payload.boothInfo || "");
      }
      if (payload.isActive !== undefined) {
        formData.append("isActive", payload.isActive.toString());
      }
      if (payload.eventLogoImage) {
        formData.append("eventLogoImage", payload.eventLogoImage);
      }

      const response = await clientAxios.put<UpdateAnnouncementResponse>(
        `/announcements/${id}`,
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

  async deleteAnnouncement(id: string): Promise<DeleteAnnouncementResponse> {
    try {
      const response = await clientAxios.delete<DeleteAnnouncementResponse>(
        `/announcements/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async toggleActive(id: string): Promise<ToggleActiveResponse> {
    try {
      const response = await clientAxios.patch<ToggleActiveResponse>(
        `/announcements/${id}/toggle`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const announcementService = new AnnouncementService();

