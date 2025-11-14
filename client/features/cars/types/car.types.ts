import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export const CAR_STATUSES = [
  "available",
  "reserved",
  "sold",
  "maintenance",
] as const;

export type CarStatus = (typeof CAR_STATUSES)[number];

export interface Car {
  _id: string;
  brandId: {
    _id: string;
    name: string;
  };
  agentId?: {
    _id: string;
    name: string;
  } | null;
  carNameId: {
    _id: string;
    name: string;
  };
  gradeId: {
    _id: string;
    name: string;
  };
  yearId: {
    _id: string;
    value: number;
  };
  chassis: string[];
  internalColors?: string[];
  externalColors?: string[];
  priceCash: number;
  priceFinance: number;
  status: CarStatus;
  reservedBy?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  images?: string[];
  description?: string;
  engine_capacity?: number;
  transmission?: "manual" | "automatic";
  fuel_capacity?: number;
  seat_type?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarsData extends PaginatedData<Car> {
  cars: Car[];
}

export type GetAllCarsResponse = ApiResponse<CarsData, true>;

export interface CreateCarPayload {
  brandId: string;
  agentId?: string;
  carNameId: string;
  gradeId: string;
  yearId: string;
  chassis: string[];
  internalColors?: string[];
  externalColors?: string[];
  priceCash: number;
  priceFinance: number;
  status?: CarStatus;
  reservedBy?: string | null;
  images?: File[];
  description?: string;
  engine_capacity?: number;
  transmission?: "manual" | "automatic";
  fuel_capacity?: number;
  seat_type?: string;
  location?: string;
}

export interface UpdateCarPayload {
  brandId?: string;
  agentId?: string;
  carNameId?: string;
  gradeId?: string;
  yearId?: string;
  chassis?: string[];
  internalColors?: string[];
  externalColors?: string[];
  priceCash?: number;
  priceFinance?: number;
  status?: CarStatus;
  reservedBy?: string | null;
  images?: File[];
  existingImagesToKeep?: string[]; // Array of image paths/URLs to keep from existing images
  description?: string;
  engine_capacity?: number;
  transmission?: "manual" | "automatic";
  fuel_capacity?: number;
  seat_type?: string;
  location?: string;
}

export interface CreateCarData {
  car: Car;
}

export interface UpdateCarData {
  car: Car;
}

export interface GetCarData {
  car: Car;
}

export type CreateCarResponse = ApiResponse<CreateCarData>;
export type UpdateCarResponse = ApiResponse<UpdateCarData>;
export type DeleteCarResponse = ApiResponse<null>;
export type GetCarResponse = ApiResponse<GetCarData>;

// Re-export Pagination type for convenience
export type { Pagination };

