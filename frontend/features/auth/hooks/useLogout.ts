"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../actions/auth.service";
import { useAuthStore } from "../stores/authStore";

interface UseLogoutReturn {
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useLogout(): UseLogoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearAuth } = useAuthStore((state) => state);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await logoutUser();
      if (!response.success) {
        throw new Error(response.message || "Logout failed");
      }
      
      // Clear the auth store
      clearAuth();

      // Use router.replace for client-side navigation without page refresh
      router.replace("/dashboard/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during logout";
      setError(errorMessage);
      
      // Even if there's an error, clear the store and redirect
      clearAuth();
      router.replace("/dashboard/login");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}

