import serverAxios from "@/lib/axios/serverAxios";
import type { GetHeroResponse } from "./heroService";
import { isSuccessResponse } from "@/utils/api.utils";

/**
 * Server-side function to fetch hero data
 * Used for prefetching in Next.js server components
 */
export async function fetchHero(): Promise<GetHeroResponse["data"]> {
  try {
    const response = await serverAxios.get<GetHeroResponse>("/hero");
    
    if (isSuccessResponse(response.data)) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    // Return null on error - client will handle error state
    console.error("Error fetching hero on server:", error);
    return null;
  }
}

