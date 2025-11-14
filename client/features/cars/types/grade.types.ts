import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface Grade {
  _id: string;
  name: string;
  carNameId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GradesData extends PaginatedData<Grade> {
  grades: Grade[];
}

export type GetAllGradesResponse = ApiResponse<GradesData, true>;

export interface CreateGradePayload {
  name: string;
  carNameId: string;
}

export interface UpdateGradePayload {
  name?: string;
  carNameId?: string;
}

export interface CreateGradeData {
  grade: Grade;
}

export interface UpdateGradeData {
  grade: Grade;
}

export interface GetGradeData {
  grade: Grade;
}

export type CreateGradeResponse = ApiResponse<CreateGradeData>;
export type UpdateGradeResponse = ApiResponse<UpdateGradeData>;
export type DeleteGradeResponse = ApiResponse<null>;
export type GetGradeResponse = ApiResponse<GetGradeData>;

// Re-export Pagination type for convenience
export type { Pagination };

