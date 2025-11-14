import { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api.types";

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    return (
      errorData?.message ||
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "حدث خطأ أثناء معالجة الطلب"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "حدث خطأ غير متوقع";
}

/**
 * Check if response is a success response
 */
export function isSuccessResponse<T>(
  response: unknown
): response is { success: true; data: T; message: string } {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === true
  );
}

/**
 * Check if response is an error response
 */
export function isErrorResponse(
  response: unknown
): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    response.success === false
  );
}

