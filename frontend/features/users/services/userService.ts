'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
  PaginatedData,
  Pagination,
} from "@/types/api.types";

export type UserRole = "admin" | "sales";
export type Branch = "riyadh" | "jeddah" | "dammam";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  rating?: number;
  image?: string;
  whatsNumber?: string;
  phoneNumber?: string;
  branch?: Branch;
  createdAt: string;
  updatedAt: string;
}

export type GetAllUsersResponse = ApiResponse<User[]>;

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  rating?: number;
  image?: File;
  whatsNumber?: string;
  phoneNumber?: string;
  branch?: Branch;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  rating?: number;
  image?: File;
  whatsNumber?: string;
  phoneNumber?: string;
  branch?: Branch;
}

export interface CreateUserData {
  user: User;
}

export interface UpdateUserData {
  user: User;
}

export interface GetUserData {
  user: User;
}

export type CreateUserResponse = ApiResponse<CreateUserData>;
export type UpdateUserResponse = ApiResponse<UpdateUserData>;
export type DeleteUserResponse = ApiResponse<null>;
export type GetUserResponse = ApiResponse<GetUserData>;

class UserService {
  async getAllUsers(signal?: AbortSignal): Promise<GetAllUsersResponse> {
    try {
      const response = await clientAxios.get<GetAllUsersResponse>("/users", {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<GetUserResponse> {
    try {
      const response = await clientAxios.get<GetUserResponse>(`/users/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      if (payload.password) formData.append("password", payload.password);
      if (payload.role) formData.append("role", payload.role);
      if (payload.rating !== undefined) formData.append("rating", payload.rating.toString());
      if (payload.whatsNumber) formData.append("whatsNumber", payload.whatsNumber);
      if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
      if (payload.branch) formData.append("branch", payload.branch);
      if (payload.image) formData.append("image", payload.image);

      const response = await clientAxios.post<CreateUserResponse>(
        "/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateUser(
    id: string,
    payload: UpdateUserPayload
  ): Promise<UpdateUserResponse> {
    try {
      const formData = new FormData();
      if (payload.name) formData.append("name", payload.name);
      if (payload.email) formData.append("email", payload.email);
      if (payload.password) formData.append("password", payload.password);
      if (payload.role) formData.append("role", payload.role);
      if (payload.rating !== undefined) formData.append("rating", payload.rating.toString());
      if (payload.whatsNumber) formData.append("whatsNumber", payload.whatsNumber);
      if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
      if (payload.branch) formData.append("branch", payload.branch);
      if (payload.image) formData.append("image", payload.image);

      const response = await clientAxios.put<UpdateUserResponse>(
        `/users/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<DeleteUserResponse> {
    try {
      const response = await clientAxios.delete<DeleteUserResponse>(
        `/users/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const userService = new UserService();

// Re-export Pagination type for convenience
export type { Pagination };

