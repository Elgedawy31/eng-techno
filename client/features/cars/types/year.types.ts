import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface Year {
  _id: string;
  value: number;
  gradeId: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface YearsData extends PaginatedData<Year> {
  years: Year[];
}

export type GetAllYearsResponse = ApiResponse<YearsData, true>;

export interface CreateYearPayload {
  value: number;
  gradeId: string;
}

export interface UpdateYearPayload {
  value?: number;
  gradeId?: string;
}

export interface CreateYearData {
  year: Year;
}

export interface UpdateYearData {
  year: Year;
}

export interface GetYearData {
  year: Year;
}

export type CreateYearResponse = ApiResponse<CreateYearData>;
export type UpdateYearResponse = ApiResponse<UpdateYearData>;
export type DeleteYearResponse = ApiResponse<null>;
export type GetYearResponse = ApiResponse<GetYearData>;

// Re-export Pagination type for convenience
export type { Pagination };

