"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useMediaCentres } from "../hooks/useMediaCentres";
import { useDeleteMediaCentre } from "../hooks/useDeleteMediaCentre";
import { useToggleActive } from "../hooks/useToggleActive";
import type { MediaCentre } from "../services/mediaCentreService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Newspaper, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { MediaCentreDialog } from "../components/MediaCentreDialog";
import { Badge } from "@/components/ui/badge";

function MediaCentreTemplate() {
  const { mediaCentres, isLoading, isError, error } = useMediaCentres();
  const { deleteMediaCentre } = useDeleteMediaCentre();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMediaCentre, setEditingMediaCentre] = useState<MediaCentre | null>(null);
  const [deletingMediaCentre, setDeletingMediaCentre] = useState<MediaCentre | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<MediaCentre>[] = [
    {
      accessorKey: "mainTitle",
      header: "Main Title",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("mainTitle")}
          </div>
        );
      },
    },
    {
      accessorKey: "mainDescription",
      header: "Main Description",
      cell: ({ row }) => {
        const description = row.getValue("mainDescription") as string;
        return (
          <div className="text-muted-foreground max-w-md truncate">
            {description}
          </div>
        );
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
  const actions: Action<MediaCentre>[] = [
    {
      label: "Edit",
      onClick: (mediaCentre) => {
        setEditingMediaCentre(mediaCentre);
        setIsDialogOpen(true);
      },
    },
    {
      label: (mediaCentre) => (mediaCentre.isActive ? "Deactivate" : "Activate"),
      onClick: async (mediaCentre) => {
        await toggleActive(mediaCentre._id);
      },
    },
    {
      label: "Delete",
      onClick: (mediaCentre) => {
        setDeletingMediaCentre(mediaCentre);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Media Centre Sections"
        description="You can manage all media centre sections here."
        actions={[
          {
            label: "Add new media centre",
            icon: Plus,
            onClick: () => {
              setEditingMediaCentre(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <MediaCentreDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingMediaCentre(null);
          }
        }}
        mediaCentre={editingMediaCentre}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingMediaCentre
            ? `Are you sure you want to delete this media centre section? This action cannot be undone.`
            : "Are you sure you want to delete this media centre section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingMediaCentre?.mainTitle}
        onConfirm={async () => {
          if (deletingMediaCentre) {
            await deleteMediaCentre(deletingMediaCentre._id);
            setDeletingMediaCentre(null);
          }
        }}
        onSuccess={() => {
          setDeletingMediaCentre(null);
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
          {mediaCentres.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Newspaper}
                  title="No media centre sections available"
                  description="No media centre sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={mediaCentres}
                actions={actions}
                tableName="Media Centre Section"
                isLoading={isLoading}
                totalItems={mediaCentres.length}
                itemsPerPage={mediaCentres.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default MediaCentreTemplate;

