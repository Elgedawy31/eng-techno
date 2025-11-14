"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UsersIcon, ImageIcon, FileText, Briefcase, Search, Newspaper, Calendar, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/stores/authStore";

const sidebarItems = [
  {
    title:"Users",
    href: "/admin",
    icon: UsersIcon,
    roles: ["admin"], 
  },
  {
    title:"Hero Sections",
    href: "/admin/hero",
    icon: ImageIcon,
    roles: ["admin"], 
  },
  {
    title:"About Sections",
    href: "/admin/about",
    icon: FileText,
    roles: ["admin"], 
  },
  {
    title:"Services",
    href: "/admin/service",
    icon: Briefcase,
    roles: ["admin"], 
  },
  {
    title:"Search Sections",
    href: "/admin/search",
    icon: Search,
    roles: ["admin"], 
  },
  {
    title:"Media Centre",
    href: "/admin/mediaCentre",
    icon: Newspaper,
    roles: ["admin"], 
  },
  {
    title:"Events",
    href: "/admin/event",
    icon: Calendar,
    roles: ["admin"], 
  },
  {
    title:"Announcements",
    href: "/admin/announcement",
    icon: Megaphone,
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
          const isActive = item.href === "/admin"
            ? pathname === "/admin" || pathname === "/admin/"
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

