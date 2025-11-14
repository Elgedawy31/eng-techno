'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllCarNamesResponse,
  GetCarNameResponse,
  CreateCarNamePayload,
  CreateCarNameResponse,
  UpdateCarNamePayload,
  UpdateCarNameResponse,
  DeleteCarNameResponse,
} from "../types/carName.types";

class CarNameService {
  async getAllCarNames(
    page: number = 1,
    limit: number = 10,
    agentId?: string,
    signal?: AbortSignal
  ): Promise<GetAllCarNamesResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (agentId) {
        params.agentId = agentId;
      }

      const response = await clientAxios.get<GetAllCarNamesResponse>("/car-names", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getCarNameById(id: string): Promise<GetCarNameResponse> {
    try {
      const response = await clientAxios.get<GetCarNameResponse>(`/car-names/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createCarName(payload: CreateCarNamePayload): Promise<CreateCarNameResponse> {
    try {
      const response = await clientAxios.post<CreateCarNameResponse>(
        "/car-names",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateCarName(
    id: string,
    payload: UpdateCarNamePayload
  ): Promise<UpdateCarNameResponse> {
    try {
      const response = await clientAxios.put<UpdateCarNameResponse>(
        `/car-names/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteCarName(id: string): Promise<DeleteCarNameResponse> {
    try {
      const response = await clientAxios.delete<DeleteCarNameResponse>(
        `/car-names/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const carNameService = new CarNameService();

