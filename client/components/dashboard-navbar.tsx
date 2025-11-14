"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

export function DashboardNavbar() {
  const { logout, loading } = useLogout();
  const { user } = useAuthStore((state) => state);
  const { theme, setTheme } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await logout();
  };


  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-semibold">
           <Image src="/logo.svg" alt="logo" width={120} height={60} />
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground capitalize mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={cn(
              "relative transition-all duration-200 hover:scale-110 active:scale-95"
            )}
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={loading}
            variant="default"

          >
            {loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </div>
      </div>

      <ConfirmationModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="تأكيد تسجيل الخروج"
        description="هل أنت متأكد من رغبتك في تسجيل الخروج؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="default"
        onConfirm={handleLogout}
        icon={<LogOut className="h-8 w-8" />}
      />
    </nav>
  );
}

