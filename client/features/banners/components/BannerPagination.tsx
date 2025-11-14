"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Pagination as PaginationType } from "../services/bannerService";

interface BannerPaginationProps {
  pagination: PaginationType;
  page: number;
  onPageChange: (page: number) => void;
}

export function BannerPagination({
  pagination,
  page,
  onPageChange,
}: BannerPaginationProps) {
  if (pagination.pages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) {
                handlePageChange(page - 1);
              }
            }}
            className={
              page <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-label="الصفحة السابقة"
          >
            <ChevronRightIcon />
            <span className="hidden sm:block">السابق</span>
          </PaginationPrevious>
        </PaginationItem>

        {/* First page */}
        {page > 2 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
            {page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Previous page */}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page - 1);
              }}
              className="cursor-pointer"
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current page */}
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            onClick={(e) => e.preventDefault()}
            className="cursor-default"
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        {/* Next page */}
        {page < pagination.pages && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page + 1);
              }}
              className="cursor-pointer"
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Last page */}
        {page < pagination.pages - 1 && (
          <>
            {page < pagination.pages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.pages);
                }}
                className="cursor-pointer"
              >
                {pagination.pages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < pagination.pages) {
                handlePageChange(page + 1);
              }
            }}
            className={
              page >= pagination.pages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-label="الصفحة التالية"
          >
            <span className="hidden sm:block">التالي</span>
            <ChevronLeftIcon />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

