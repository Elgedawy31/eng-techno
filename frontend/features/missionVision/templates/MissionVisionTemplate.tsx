"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useMissionVisions } from "../hooks/useMissionVisions";
import { useDeleteMissionVision } from "../hooks/useDeleteMissionVision";
import { useToggleActive } from "../hooks/useToggleActive";
import type { MissionVision } from "../services/missionVisionService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Target, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { MissionVisionDialog } from "../components/MissionVisionDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function MissionVisionTemplate() {
  const { missionVisions, isLoading, isError, error } = useMissionVisions();
  const { deleteMissionVision } = useDeleteMissionVision();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMissionVision, setEditingMissionVision] = useState<MissionVision | null>(null);
  const [deletingMissionVision, setDeletingMissionVision] = useState<MissionVision | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get all images for lightbox
  const allImages = missionVisions.flatMap((mv) => [
    mv.missionLogoImage,
    mv.missionImage,
    mv.visionLogoImage,
    mv.visionImage,
  ].filter(Boolean));

  const columns: ColumnDef<MissionVision>[] = [
    {
      accessorKey: "missionTitle",
      header: "Mission Title",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("missionTitle")}
          </div>
        );
      },
    },
    {
      accessorKey: "visionTitle",
      header: "Vision Title",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("visionTitle")}
          </div>
        );
      },
    },
    {
      accessorKey: "missionDescription",
      header: "Mission Description",
      cell: ({ row }) => {
        const description = row.getValue("missionDescription") as string;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
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
  const actions: Action<MissionVision>[] = [
    {
      label: "Edit",
      onClick: (missionVision) => {
        setEditingMissionVision(missionVision);
        setIsDialogOpen(true);
      },
    },
    {
      label: (missionVision) => (missionVision.isActive ? "Deactivate" : "Activate"),
      onClick: async (missionVision) => {
        await toggleActive(missionVision._id);
      },
    },
    {
      label: "Delete",
      onClick: (missionVision) => {
        setDeletingMissionVision(missionVision);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Mission & Vision"
        description="You can manage all mission & vision sections here."
        actions={[
          {
            label: "Add new mission & vision",
            icon: Plus,
            onClick: () => {
              setEditingMissionVision(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <MissionVisionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingMissionVision(null);
          }
        }}
        missionVision={editingMissionVision}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingMissionVision
            ? `Are you sure you want to delete this mission & vision section? This action cannot be undone.`
            : "Are you sure you want to delete this mission & vision section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingMissionVision?.missionTitle}
        onConfirm={async () => {
          if (deletingMissionVision) {
            await deleteMissionVision(deletingMissionVision._id);
            setDeletingMissionVision(null);
          }
        }}
        onSuccess={() => {
          setDeletingMissionVision(null);
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
          {missionVisions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Target}
                  title="No mission & vision sections available"
                  description="No mission & vision sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={missionVisions}
                actions={actions}
                tableName="Mission & Vision Section"
                isLoading={isLoading}
                totalItems={missionVisions.length}
                itemsPerPage={missionVisions.length || 10}
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
        slides={allImages.map((url) => ({
          src: url as string,
          alt: "Mission & Vision image",
        }))}
      />
    </section>
  );
}

export default MissionVisionTemplate;

