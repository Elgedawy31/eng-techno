'use client';
import clientAxios from "@/lib/axios/clientAxios";
import type {
  ApiResponse,
  Pagination,
} from "@/types/api.types";

export type UserRole = "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type GetAllUsersResponse = ApiResponse<User[]>;

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
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
      const response = await clientAxios.post<CreateUserResponse>(
        "/users",
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
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
      const response = await clientAxios.put<UpdateUserResponse>(
        `/users/${id}`,
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
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

