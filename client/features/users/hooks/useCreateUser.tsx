"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService, type CreateUserPayload } from "../services/userService";
import { isSuccessResponse, getErrorMessage } from "@/utils/api.utils";

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const response = await userService.createUser(payload);
      if (isSuccessResponse(response)) {
        return response.data;
      }
      throw new Error(response.message || "Failed to create user");
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم إضافة المستخدم بنجاح!");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "حدث خطأ أثناء إضافة المستخدم");
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

