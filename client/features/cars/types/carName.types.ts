import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface CarName {
  _id: string;
  name: string;
  agentId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CarNamesData extends PaginatedData<CarName> {
  carNames: CarName[];
}

export type GetAllCarNamesResponse = ApiResponse<CarNamesData, true>;

export interface CreateCarNamePayload {
  name: string;
  agentId: string;
}

export interface UpdateCarNamePayload {
  name?: string;
  agentId?: string;
}

export interface CreateCarNameData {
  carName: CarName;
}

export interface UpdateCarNameData {
  carName: CarName;
}

export interface GetCarNameData {
  carName: CarName;
}

export type CreateCarNameResponse = ApiResponse<CreateCarNameData>;
export type UpdateCarNameResponse = ApiResponse<UpdateCarNameData>;
export type DeleteCarNameResponse = ApiResponse<null>;
export type GetCarNameResponse = ApiResponse<GetCarNameData>;

// Re-export Pagination type for convenience
export type { Pagination };

