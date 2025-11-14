'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  GetAllGradesResponse,
  GetGradeResponse,
  CreateGradePayload,
  CreateGradeResponse,
  UpdateGradePayload,
  UpdateGradeResponse,
  DeleteGradeResponse,
} from "../types/grade.types";

class GradeService {
  async getAllGrades(
    page: number = 1,
    limit: number = 10,
    carNameId?: string,
    signal?: AbortSignal
  ): Promise<GetAllGradesResponse> {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (carNameId) {
        params.carNameId = carNameId;
      }

      const response = await clientAxios.get<GetAllGradesResponse>("/grades", {
        params,
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getGradeById(id: string): Promise<GetGradeResponse> {
    try {
      const response = await clientAxios.get<GetGradeResponse>(`/grades/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createGrade(payload: CreateGradePayload): Promise<CreateGradeResponse> {
    try {
      const response = await clientAxios.post<CreateGradeResponse>(
        "/grades",
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateGrade(
    id: string,
    payload: UpdateGradePayload
  ): Promise<UpdateGradeResponse> {
    try {
      const response = await clientAxios.put<UpdateGradeResponse>(
        `/grades/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteGrade(id: string): Promise<DeleteGradeResponse> {
    try {
      const response = await clientAxios.delete<DeleteGradeResponse>(
        `/grades/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const gradeService = new GradeService();

