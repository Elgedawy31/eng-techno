'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllCarsResponse,
  GetCarResponse,
  CreateCarPayload,
  CreateCarResponse,
  UpdateCarPayload,
  UpdateCarResponse,
  DeleteCarResponse,
  CarStatus,
} from "../types/car.types";

class CarService {
  async getAllCars(
    page: number = 1,
    limit: number = 10,
    filters?: {
      brandId?: string;
      agentId?: string;
      carNameId?: string;
      gradeId?: string;
      yearId?: string;
      status?: CarStatus;
      priceCashMin?: number;
      priceCashMax?: number;
      priceFinanceMin?: number;
      priceFinanceMax?: number;
    },
    signal?: AbortSignal
  ): Promise<GetAllCarsResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (filters?.brandId) params.brandId = filters.brandId;
      if (filters?.agentId) params.agentId = filters.agentId;
      if (filters?.carNameId) params.carNameId = filters.carNameId;
      if (filters?.gradeId) params.gradeId = filters.gradeId;
      if (filters?.yearId) params.yearId = filters.yearId;
      if (filters?.status) params.status = filters.status;
      if (filters?.priceCashMin !== undefined) params.priceCashMin = filters.priceCashMin;
      if (filters?.priceCashMax !== undefined) params.priceCashMax = filters.priceCashMax;
      if (filters?.priceFinanceMin !== undefined) params.priceFinanceMin = filters.priceFinanceMin;
      if (filters?.priceFinanceMax !== undefined) params.priceFinanceMax = filters.priceFinanceMax;

      const response = await clientAxios.get<GetAllCarsResponse>("/cars", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getCarById(id: string): Promise<GetCarResponse> {
    try {
      const response = await clientAxios.get<GetCarResponse>(`/cars/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createCar(payload: CreateCarPayload): Promise<CreateCarResponse> {
    try {
      const formData = new FormData();
      
      // Append basic fields
      formData.append("brandId", payload.brandId);
      formData.append("agentId", payload.agentId);
      formData.append("carNameId", payload.carNameId);
      formData.append("gradeId", payload.gradeId);
      formData.append("yearId", payload.yearId);
      
      // Append arrays as JSON strings
      formData.append("chassis", JSON.stringify(payload.chassis));
      if (payload.internalColors) {
        formData.append("internalColors", JSON.stringify(payload.internalColors));
      }
      if (payload.externalColors) {
        formData.append("externalColors", JSON.stringify(payload.externalColors));
      }
      
      formData.append("priceCash", payload.priceCash.toString());
      formData.append("priceFinance", payload.priceFinance.toString());
      
      if (payload.status) formData.append("status", payload.status);
      if (payload.reservedBy) formData.append("reservedBy", payload.reservedBy);
      if (payload.description) formData.append("description", payload.description);
      if (payload.engine_capacity !== undefined) {
        formData.append("engine_capacity", payload.engine_capacity.toString());
      }
      if (payload.transmission) formData.append("transmission", payload.transmission);
      if (payload.fuel_capacity !== undefined) {
        formData.append("fuel_capacity", payload.fuel_capacity.toString());
      }
      if (payload.seat_type) formData.append("seat_type", payload.seat_type);
      if (payload.location) formData.append("location", payload.location);
      
      // Append images
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await clientAxios.post<CreateCarResponse>(
        "/cars",
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

  async updateCar(
    id: string,
    payload: UpdateCarPayload
  ): Promise<UpdateCarResponse> {
    try {
      const formData = new FormData();
      
      // Append basic fields if provided
      if (payload.brandId) formData.append("brandId", payload.brandId);
      if (payload.agentId) formData.append("agentId", payload.agentId);
      if (payload.carNameId) formData.append("carNameId", payload.carNameId);
      if (payload.gradeId) formData.append("gradeId", payload.gradeId);
      if (payload.yearId) formData.append("yearId", payload.yearId);
      
      // Append arrays as JSON strings if provided
      if (payload.chassis) {
        formData.append("chassis", JSON.stringify(payload.chassis));
      }
      if (payload.internalColors) {
        formData.append("internalColors", JSON.stringify(payload.internalColors));
      }
      if (payload.externalColors) {
        formData.append("externalColors", JSON.stringify(payload.externalColors));
      }
      
      if (payload.priceCash !== undefined) {
        formData.append("priceCash", payload.priceCash.toString());
      }
      if (payload.priceFinance !== undefined) {
        formData.append("priceFinance", payload.priceFinance.toString());
      }
      
      if (payload.status) formData.append("status", payload.status);
      // Handle reservedBy: send empty string if null/empty (server will convert to null)
      if (payload.reservedBy !== undefined) {
        formData.append("reservedBy", payload.reservedBy || "");
      }
      if (payload.description) formData.append("description", payload.description);
      if (payload.engine_capacity !== undefined) {
        formData.append("engine_capacity", payload.engine_capacity.toString());
      }
      if (payload.transmission) formData.append("transmission", payload.transmission);
      if (payload.fuel_capacity !== undefined) {
        formData.append("fuel_capacity", payload.fuel_capacity.toString());
      }
      if (payload.seat_type) formData.append("seat_type", payload.seat_type);
      if (payload.location) formData.append("location", payload.location);
      
      // Append images if provided
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((image) => {
          formData.append("images", image);
        });
      }
      
      // Append existing images to keep if provided (for update operations)
      if (payload.existingImagesToKeep) {
        formData.append("existingImagesToKeep", JSON.stringify(payload.existingImagesToKeep));
      }

      const response = await clientAxios.put<UpdateCarResponse>(
        `/cars/${id}`,
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

  async deleteCar(id: string): Promise<DeleteCarResponse> {
    try {
      const response = await clientAxios.delete<DeleteCarResponse>(
        `/cars/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const carService = new CarService();

