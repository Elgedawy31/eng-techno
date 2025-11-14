import serverAxios from "@/lib/axios/serverAxios";
import type { GetAboutResponse } from "./aboutService";
import { isSuccessResponse } from "@/utils/api.utils";

/**
 * Server-side function to fetch about data
 * Used for server-side rendering in Next.js server components
 */
export async function fetchAbout(): Promise<GetAboutResponse["data"]> {
  try {
    const response = await serverAxios.get<GetAboutResponse>("/about");
    
    if (isSuccessResponse(response.data)) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    // Return null on error - client will handle error state
    console.error("Error fetching about on server:", error);
    return null;
  }
}

