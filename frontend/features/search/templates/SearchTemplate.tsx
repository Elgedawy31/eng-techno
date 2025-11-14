"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useSearches } from "../hooks/useSearches";
import { useDeleteSearch } from "../hooks/useDeleteSearch";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Search } from "../services/searchService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Search as SearchIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { SearchDialog } from "../components/SearchDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function SearchTemplate() {
  const { searches, isLoading, isError, error } = useSearches();
  const { deleteSearch } = useDeleteSearch();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSearch, setEditingSearch] = useState<Search | null>(null);
  const [deletingSearch, setDeletingSearch] = useState<Search | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get searches with images for lightbox
  const searchesWithImages = searches.filter((search) => search.logoImage);

  const columns: ColumnDef<Search>[] = [
    {
      accessorKey: "logoImage",
      header: "Logo",
      cell: ({ row }) => {
        const imageUrl = row.getValue("logoImage") as string | undefined;
        const search = row.original;
        
        const handleImageClick = () => {
          if (imageUrl) {
            const lightboxIdx = searchesWithImages.findIndex(
              (s) => s._id === search._id
            );
            if (lightboxIdx !== -1) {
              setLightboxIndex(lightboxIdx);
              setLightboxOpen(true);
            }
          }
        };

        return (
          <div 
            className={cn(
              "w-20 h-20 rounded-lg overflow-hidden border border-border",
              imageUrl && "cursor-pointer hover:opacity-80 transition-opacity"
            )}
            onClick={handleImageClick}
          >
            {imageUrl ? (
              <Image
                width={80}
                height={80}
                src={imageUrl}
                alt="Search logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <SearchIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("title")}
          </div>
        );
      },
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {row.getValue("subtitle")}
          </div>
        );
      },
    },
    {
      accessorKey: "placeholder",
      header: "Placeholder",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {row.getValue("placeholder")}
          </div>
        );
      },
    },
    {
      accessorKey: "buttonText",
      header: "Button Text",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("buttonText")}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Creation date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <div className="text-muted-foreground">
            {dayjs(date).format("DD MMMM YYYY")}
          </div>
        );
      },
    },
  ];

  // Define actions
  const actions: Action<Search>[] = [
    {
      label: "Edit",
      onClick: (search) => {
        setEditingSearch(search);
        setIsDialogOpen(true);
      },
    },
    {
      label: (search) => (search.isActive ? "Deactivate" : "Activate"),
      onClick: async (search) => {
        await toggleActive(search._id);
      },
    },
    {
      label: "Delete",
      onClick: (search) => {
        setDeletingSearch(search);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Search Sections"
        description="You can manage all search sections here."
        actions={[
          {
            label: "Add new search",
            icon: Plus,
            onClick: () => {
              setEditingSearch(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <SearchDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSearch(null);
          }
        }}
        search={editingSearch}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingSearch
            ? `Are you sure you want to delete this search section? This action cannot be undone.`
            : "Are you sure you want to delete this search section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingSearch?.title}
        onConfirm={async () => {
          if (deletingSearch) {
            await deleteSearch(deletingSearch._id);
            setDeletingSearch(null);
          }
        }}
        onSuccess={() => {
          setDeletingSearch(null);
        }}
      />

      {isLoading && <UniLoading />}

      {!isLoading && isError && (
        <Card>
          <CardContent className="pt-6">
            <NoDataMsg
              icon={AlertCircle}
              title="An error occurred"
              description={getErrorMessage(error) || "An error occurred while fetching the data"}
              iconBgColor="bg-destructive/10"
              iconColor="text-destructive"
            />
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <div className="space-y-6">
          {searches.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={SearchIcon}
                  title="No search sections available"
                  description="No search sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={searches}
                actions={actions}
                tableName="Search Section"
                isLoading={isLoading}
                totalItems={searches.length}
                itemsPerPage={searches.length || 10}
              />
            </Card>
          )}
        </div>
      )}

      {/* Lightbox for image preview */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={searchesWithImages.map((search) => ({
          src: search.logoImage!,
          alt: search.title || "Search logo",
        }))}
      />
    </section>
  );
}

export default SearchTemplate;

