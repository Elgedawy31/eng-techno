export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OptionType {
  name: string;
  id: string | number;
}
export interface ApiSuccessResponse<T, P extends boolean = false> {
  success: true;
  message: string;
  data: P extends true
    ? T & { pagination: Pagination }
    : T extends { pagination: Pagination }
    ? T
    : T;
}
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code?: string | number;
    details?: string | Record<string, unknown>;
    stack?: string;
  };
  data?: null;
}

export type ApiResponse<T, P extends boolean = false> =
  | ApiSuccessResponse<T, P>
  | ApiErrorResponse;

export interface PaginatedData<T> {
  pagination: Pagination;
  [key: string]: T[] | Pagination;
}
export type ExtractDataFromPaginatedResponse<T> = T extends ApiSuccessResponse<
  infer D,
  true
>
  ? D extends PaginatedData<infer Item>
    ? Item
    : D
  : T extends ApiSuccessResponse<infer D, false>
  ? D
  : never;


export interface AxiosErrorResponse {
  response?: {
    data?: ApiErrorResponse | { message?: string; error?: unknown };
    status?: number;
    statusText?: string;
  };
  message?: string;
}

