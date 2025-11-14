"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import type { UserRole, Branch } from "../services/userService";
import { BRANCHES } from "../schemas/user.schema";
import { cn } from "@/lib/utils";

interface UsersFilterProps {
  onFilterChange: (filters: { search?: string; role?: UserRole; branch?: Branch; rating?: number }) => void;
  initialSearch?: string;
  initialRole?: UserRole;
  initialBranch?: Branch;
  initialRating?: number;
}

// Translate role to Arabic
const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: "مدير",
    sales: "مندوب مبيعات",
  };
  return roleMap[role] || role;
};

// Translate branch to Arabic
const getBranchLabel = (branch: Branch): string => {
  const branchMap: Record<Branch, string> = {
    riyadh: "الرياض",
    jeddah: "جدة",
    dammam: "الدمام",
  };
  return branchMap[branch] || branch;
};

export function UsersFilter({
  onFilterChange,
  initialSearch = "",
  initialRole,
  initialBranch,
  initialRating,
}: UsersFilterProps) {
  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState<UserRole | "all">(initialRole || "all");
  const [branch, setBranch] = useState<Branch | "all">(initialBranch || "all");
  const [rating, setRating] = useState<number | "all">(initialRating !== undefined ? initialRating : "all");

  // Debounce search input to prevent too many requests
  const debouncedSearch = useDebounce(search, 500);

  // Update filters when debounced search, role, branch, or rating changes
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch.trim() || undefined,
      role: role !== "all" ? role : undefined,
      branch: branch !== "all" ? branch : undefined,
      rating: rating !== "all" && typeof rating === "number" ? rating : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, role, branch, rating]);

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleClearRole = () => {
    setRole("all");
  };

  const handleClearBranch = () => {
    setBranch("all");
  };

  const handleClearRating = () => {
    setRating("all");
  };

  const hasActiveFilters = search.trim() !== "" || role !== "all" || branch !== "all" || (rating !== "all" && typeof rating === "number");

  const handleClearAll = () => {
    setSearch("");
    setRole("all");
    setBranch("all");
    setRating("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">البحث والفلترة</h3>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">البحث بالاسم أو البريد الإلكتروني</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "pr-9",
                search && "pl-9"
              )}
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label htmlFor="role">فلترة حسب الدور</Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole | "all")}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="جميع الأدوار">
                {role === "all" ? "جميع الأدوار" : getRoleLabel(role)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأدوار</SelectItem>
              <SelectItem value="user">مستخدم</SelectItem>
              <SelectItem value="admin">مدير</SelectItem>
              <SelectItem value="sales">مندوب مبيعات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Branch Filter - Only show when role is sales or all */}
        {(role === "sales" || role === "all") && (
          <div className="space-y-2">
            <Label htmlFor="branch">فلترة حسب الفرع</Label>
            <Select
              value={branch}
              onValueChange={(value) => setBranch(value as Branch | "all")}
            >
              <SelectTrigger id="branch" className="w-full">
                <SelectValue placeholder="جميع الفروع">
                  {branch === "all" ? "جميع الفروع" : getBranchLabel(branch)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفروع</SelectItem>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>
                    {getBranchLabel(b)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Rating Filter - Only show when role is sales or all */}
        {(role === "sales" || role === "all") && (
          <div className="space-y-2">
            <Label htmlFor="rating">فلترة حسب التقييم</Label>
            <Select
              value={rating === "all" ? "all" : rating.toString()}
              onValueChange={(value) => {
                if (value === "all") {
                  setRating("all");
                } else {
                  setRating(parseFloat(value));
                }
              }}
            >
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="جميع التقييمات">
                  {rating === "all" ? "جميع التقييمات" : `${rating}+`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="0">0+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">المرشحات النشطة:</span>
          {search.trim() && (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              <span>البحث: {search}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-primary/20"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {role !== "all" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground">
              <span>الدور: {getRoleLabel(role)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-secondary/20"
                onClick={handleClearRole}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {branch !== "all" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground">
              <span>الفرع: {getBranchLabel(branch)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-secondary/20"
                onClick={handleClearBranch}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {rating !== "all" && typeof rating === "number" && (
            <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground">
              <span>التقييم: {rating}+</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-secondary/20"
                onClick={handleClearRating}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

