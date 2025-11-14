"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {  HomeIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/stores/authStore";

const sidebarItems = [
  {
    title:"Home",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["admin"], 
  },
 
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UsersIcon,
    roles: ["admin"], 
  },
 
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "user";

  const filteredItems = sidebarItems.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex-1 space-y-2 p-4">
        {filteredItems.map((item) => {
          // For home route, only match exactly. For other routes, match the route and its children
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard" || pathname === "/dashboard/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-300 ease-out",
                  isActive
                    ? "scale-110 rotate-6"
                    : "group-hover:scale-125 group-hover:rotate-12"
                )}
              />
              <span className={cn(
                "flex-1 transition-all duration-300",
                !isActive && "group-hover:-translate-x-1"
              )}>
                {item.title}
              </span>
              {isActive && (
                <span className="absolute right-0 h-full w-1 rounded-l-full bg-sidebar-primary-foreground/30" />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

