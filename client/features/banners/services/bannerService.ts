'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface Banner {
  _id: string;
  bannername: string;
  image_path_lg: string | null;
  image_path_small: string | null;
  expiration_date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannersData extends PaginatedData<Banner> {
  banners: Banner[];
}

export type GetAllBannersResponse = ApiResponse<BannersData, true>;

export interface CreateBannerPayload {
  bannername: string;
  expiration_date: string;
  large_image: File;
  small_image?: File;
}

export interface UpdateBannerPayload {
  bannername?: string;
  expiration_date?: string;
  large_image?: File;
  small_image?: File;
}

export interface CreateBannerData {
  banner: Banner;
}

export interface UpdateBannerData {
  banner: Banner;
}

export type CreateBannerResponse = ApiResponse<CreateBannerData>;
export type UpdateBannerResponse = ApiResponse<UpdateBannerData>;
export type DeleteBannerResponse = ApiResponse<null>;

class BannerService {
  async getAllBanners(page: number = 1, limit: number = 10): Promise<GetAllBannersResponse> {
    try {
      const response = await clientAxios.get<GetAllBannersResponse>("/banners", {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createBanner(payload: CreateBannerPayload): Promise<CreateBannerResponse> {
    try {
      const formData = new FormData();
      formData.append("bannername", payload.bannername);
      formData.append("expiration_date", payload.expiration_date);
      formData.append("large_image", payload.large_image);
      
      if (payload.small_image) {
        formData.append("small_image", payload.small_image);
      }

      const response = await clientAxios.post<CreateBannerResponse>(
        "/banners",
        formData,
        {
          // Let axios automatically set Content-Type with boundary for FormData
          headers: {
            "Content-Type": undefined,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateBanner(
    id: string,
    payload: UpdateBannerPayload
  ): Promise<UpdateBannerResponse> {
    try {
      const formData = new FormData();
      
      if (payload.bannername) {
        formData.append("bannername", payload.bannername);
      }
      if (payload.expiration_date) {
        formData.append("expiration_date", payload.expiration_date);
      }
      if (payload.large_image) {
        formData.append("large_image", payload.large_image);
      }
      if (payload.small_image) {
        formData.append("small_image", payload.small_image);
      }

      const response = await clientAxios.put<UpdateBannerResponse>(
        `/banners/${id}`,
        formData,
        {
          // Let axios automatically set Content-Type with boundary for FormData
          headers: {
            "Content-Type": undefined,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteBanner(id: string): Promise<DeleteBannerResponse> {
    try {
      const response = await clientAxios.delete<DeleteBannerResponse>(
        `/banners/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const bannerService = new BannerService();

// Re-export Pagination type for convenience
export type { Pagination };

