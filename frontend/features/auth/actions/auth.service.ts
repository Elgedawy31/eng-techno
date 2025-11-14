"use server";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import serverAxios from "@/lib/axios/serverAxios";
import { User } from "../types";

interface GetProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
  };
}

interface AuthActionResponse {
  success: boolean;
  message: string;
  status?: string;
  code?: number;
  temp_token?: string;
  data?: {
    user?: User;
    accessToken?: string;
  };
  user?: User; // Keep for backward compatibility
}

export async function authAction(
  payload: FormData | Record<string, string | number | boolean>,
  endPoint: string
): Promise<AuthActionResponse> {
  try {
    const headers: Record<string, string> = {};
    let data: FormData | string;

    if (payload instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
      data = payload;
    } else {
      headers["Content-Type"] = "application/json";
      data = JSON.stringify(payload);
    }

    const response = await serverAxios.post(endPoint, data, {
      headers,
    });
    const responseData = response.data;
    // Handle new response structure: data.accessToken
    const accessToken = responseData?.data?.accessToken || responseData?.user?.token;
    if (accessToken) {
      (await cookies()).set("token", accessToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return responseData;
  } 
  catch (error: unknown) {
    const err = error as AxiosError<{ message?: string; status?: string; code?: number; temp_token?: string }>;
    const message =
      err.response?.data?.message || "Something went wrong";

    return {
      success: false,
      message,
      status: err.response?.data?.status,
      code: err.response?.data?.code,
      temp_token: err.response?.data?.temp_token,
      user: (err.response?.data as AuthActionResponse)?.user, // Safely access user from data if it exists
    };
  }
}



export async function getProfile(): Promise<{
  user: User | null;
  token: string | null;
}> {
  if (!(await cookies()).get("token")) {
    return {
      user: null,
      token: null,
    };
  }

  try {
    const response = await serverAxios.get<GetProfileResponse>("/auth/user-data");
    // Use token from response if available, otherwise fall back to cookie
    const token = response.data?.data?.accessToken || (await cookies()).get("token")?.value || null;
    
    return {
      user: response.data?.data?.user || null,
      token,
    };
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return {
      user: null,
      token: null,
    };
  }
}



export async function loginUser(credentials: { email: string; password: string }): Promise<AuthActionResponse> {
  try {
    const res = await authAction(credentials, "/auth/login");
    const accessToken = res?.data?.accessToken;
    if (accessToken) {
      revalidatePath("/dashboard", "layout");
      return {
        success: true,
        message: res.message || "Login successful!",
        data: res.data,
      };
    }
    else {
      return {
        success: false,
        message: res.message || "Something went wrong during login",
      };
    }
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || "Something went wrong during login";
    return {
      success: false,
      message: message || "Something went wrong. Please try again.",
    };
  }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    // Call the logout endpoint
    await serverAxios.get("/auth/logout");
    
    // Clear the token cookie
    (await cookies()).delete("token");
    (await cookies()).delete("accessToken");
    
    // Revalidate the dashboard path
    revalidatePath("/dashboard", "layout");
    
    return {
      success: true,
      message: "Logout successful!",
    };
  } catch (error) {
    // Even if the server call fails, clear the local cookie
    (await cookies()).delete("token");
    (await cookies()).delete("accessToken");
    revalidatePath("/dashboard", "layout");
    
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || "Logout completed locally";
    
    return {
      success: true, // Still return success since we cleared the cookie
      message: message,
    };
  }
}
