'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllYearsResponse,
  GetYearResponse,
  CreateYearPayload,
  CreateYearResponse,
  UpdateYearPayload,
  UpdateYearResponse,
  DeleteYearResponse,
} from "../types/year.types";

class YearService {
  async getAllYears(
    page: number = 1,
    limit: number = 10,
    gradeId?: string,
    signal?: AbortSignal
  ): Promise<GetAllYearsResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (gradeId) {
        params.gradeId = gradeId;
      }

      const response = await clientAxios.get<GetAllYearsResponse>("/years", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getYearById(id: string): Promise<GetYearResponse> {
    try {
      const response = await clientAxios.get<GetYearResponse>(`/years/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createYear(payload: CreateYearPayload): Promise<CreateYearResponse> {
    try {
      const response = await clientAxios.post<CreateYearResponse>(
        "/years",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateYear(
    id: string,
    payload: UpdateYearPayload
  ): Promise<UpdateYearResponse> {
    try {
      const response = await clientAxios.put<UpdateYearResponse>(
        `/years/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteYear(id: string): Promise<DeleteYearResponse> {
    try {
      const response = await clientAxios.delete<DeleteYearResponse>(
        `/years/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const yearService = new YearService();

