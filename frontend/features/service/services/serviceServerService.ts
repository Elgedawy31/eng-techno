import serverAxios from "@/lib/axios/serverAxios";
import type { GetServicesResponse } from "./serviceService";
import { isSuccessResponse } from "@/utils/api.utils";

/**
 * Server-side function to fetch services data
 * Used for server-side rendering in Next.js server components
 */
export async function fetchServices(): Promise<GetServicesResponse["data"]> {
  try {
    const response = await serverAxios.get<GetServicesResponse>("/services");
    
    if (isSuccessResponse(response.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    // Return empty array on error - client will handle error state
    console.error("Error fetching services on server:", error);
    return [];
  }
}

