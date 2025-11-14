"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { getQueryClient } from "@/utils/queryClient";
import AuthProvider from "@/providers/AuthProvider";
import { User } from "@/features/auth/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const queryClient = getQueryClient();

// Core providers that don't need auth data - used globally
export function CoreProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
        <Toaster />
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

// AuthProvider wrapper - used in dashboard (CoreProviders already wraps from root)
export function Providers({
  children,
  data,
}: {
  children: React.ReactNode;
  data: { token?: string | null; user: User | null };
}) {
  return (
    <AuthProvider user={data?.user ?? null} token={data?.token ?? null}>
      {children}
    </AuthProvider>
  );
}
