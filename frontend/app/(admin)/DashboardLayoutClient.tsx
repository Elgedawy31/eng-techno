"use client";

import { DashboardNavbar } from "@/components/dashboard-navbar";
import { Sidebar } from "@/components/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useEffect, useMemo } from "react";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "sales";
  const isLoginPage = pathname === "/admin/login";

  const restrictedRoutes = useMemo(() => ["/admin/banners", "/admin/users"], []);

  useEffect(() => {
    if (!isLoginPage && restrictedRoutes.includes(pathname)) {
      if (userRole === "sales") {
        router.replace("/admin");
      }
    }
  }, [pathname, userRole, isLoginPage, router , restrictedRoutes]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Don't render the page if user is trying to access restricted route
  if (restrictedRoutes.includes(pathname) && userRole === "user") {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <DashboardNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

