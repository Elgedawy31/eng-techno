"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

export function DashboardNavbar() {
  const { logout, loading } = useLogout();
  const { user } = useAuthStore((state) => state);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={loading}
            variant="default"

          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <ConfirmationModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
          title="Confirm logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="default"
        onConfirm={handleLogout}
        icon={<LogOut className="h-8 w-8" />}
      />
    </nav>
  );
}

