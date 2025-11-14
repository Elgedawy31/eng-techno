"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useDeleteAnnouncement } from "../hooks/useDeleteAnnouncement";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Announcement } from "../services/announcementService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Megaphone, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AnnouncementDialog } from "../components/AnnouncementDialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function AnnouncementTemplate() {
  const { announcements, isLoading, isError, error } = useAnnouncements();
  const { deleteAnnouncement } = useDeleteAnnouncement();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: "eventLogoImage",
      header: "Logo",
      cell: ({ row }) => {
        const imageUrl = row.getValue("eventLogoImage") as string | undefined;
        
        return (
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
            {imageUrl ? (
              <Image
                width={80}
                height={80}
                src={imageUrl}
                alt="Announcement logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Megaphone className="w-6 h-6 text-muted-foreground" />
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
      accessorKey: "tagline",
      header: "Tagline",
      cell: ({ row }) => {
        const tagline = row.getValue("tagline") as string | undefined;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {tagline || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "eventDateText",
      header: "Event Date",
      cell: ({ row }) => {
        const eventDateText = row.getValue("eventDateText") as string | undefined;
        return (
          <div className="text-sm">
            {eventDateText || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "boothInfo",
      header: "Booth Info",
      cell: ({ row }) => {
        const boothInfo = row.getValue("boothInfo") as string | undefined;
        return (
          <div className="text-sm">
            {boothInfo || "-"}
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
  const actions: Action<Announcement>[] = [
    {
      label: "Edit",
      onClick: (announcement) => {
        setEditingAnnouncement(announcement);
        setIsDialogOpen(true);
      },
    },
    {
      label: (announcement) => (announcement.isActive ? "Deactivate" : "Activate"),
      onClick: async (announcement) => {
        await toggleActive(announcement._id);
      },
    },
    {
      label: "Delete",
      onClick: (announcement) => {
        setDeletingAnnouncement(announcement);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Announcements"
        description="You can manage all announcements here."
        actions={[
          {
            label: "Add new announcement",
            icon: Plus,
            onClick: () => {
              setEditingAnnouncement(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <AnnouncementDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAnnouncement(null);
          }
        }}
        announcement={editingAnnouncement}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingAnnouncement
            ? `Are you sure you want to delete this announcement? This action cannot be undone.`
            : "Are you sure you want to delete this announcement? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingAnnouncement?.title}
        onConfirm={async () => {
          if (deletingAnnouncement) {
            await deleteAnnouncement(deletingAnnouncement._id);
            setDeletingAnnouncement(null);
          }
        }}
        onSuccess={() => {
          setDeletingAnnouncement(null);
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
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Megaphone}
                  title="No announcements available"
                  description="No announcements have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={announcements}
                actions={actions}
                tableName="Announcement"
                isLoading={isLoading}
                totalItems={announcements.length}
                itemsPerPage={announcements.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default AnnouncementTemplate;

