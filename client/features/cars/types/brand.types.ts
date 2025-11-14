import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export interface Brand {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsData extends PaginatedData<Brand> {
  brands: Brand[];
}

export type GetAllBrandsResponse = ApiResponse<BrandsData, true>;

export interface CreateBrandPayload {
  name: string;
  image?: File;
}

export interface UpdateBrandPayload {
  name?: string;
  image?: File;
}

export interface CreateBrandData {
  brand: Brand;
}

export interface UpdateBrandData {
  brand: Brand;
}

export interface GetBrandData {
  brand: Brand;
}

export type CreateBrandResponse = ApiResponse<CreateBrandData>;
export type UpdateBrandResponse = ApiResponse<UpdateBrandData>;
export type DeleteBrandResponse = ApiResponse<null>;
export type GetBrandResponse = ApiResponse<GetBrandData>;

// Re-export Pagination type for convenience
export type { Pagination };

