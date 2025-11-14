"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAbouts } from "../hooks/useAbouts";
import { useDeleteAbout } from "../hooks/useDeleteAbout";
import { useToggleActive } from "../hooks/useToggleActive";
import type { About } from "../services/aboutService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, FileText, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AboutDialog } from "../components/AboutDialog";
import { Badge } from "@/components/ui/badge";

function AboutTemplate() {
  const { abouts, isLoading, isError, error } = useAbouts();
  const { deleteAbout } = useDeleteAbout();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAbout, setEditingAbout] = useState<About | null>(null);
  const [deletingAbout, setDeletingAbout] = useState<About | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<About>[] = [
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("label") || "//DEFINING TECHNO"}
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
          <div className="text-muted-foreground max-w-md truncate">
            {description}
          </div>
        );
      },
    },
    {
      accessorKey: "button1Text",
      header: "Button 1",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("button1Text")}</div>;
      },
    },
    {
      accessorKey: "button2Text",
      header: "Button 2",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("button2Text")}</div>;
      },
    },
    {
      accessorKey: "companyProfileFile",
      header: "Company Profile",
      cell: ({ row }) => {
        const fileUrl = row.getValue("companyProfileFile") as string;
        return (
          <div>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                View PDF
              </a>
            ) : (
              <span className="text-muted-foreground text-sm">No file</span>
            )}
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
  const actions: Action<About>[] = [
    {
      label: "Edit",
      onClick: (about) => {
        setEditingAbout(about);
        setIsDialogOpen(true);
      },
    },
    {
      label: (about) => (about.isActive ? "Deactivate" : "Activate"),
      onClick: async (about) => {
        await toggleActive(about._id);
      },
    },
    {
      label: "Delete",
      onClick: (about) => {
        setDeletingAbout(about);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="About Sections"
        description="You can manage all about sections here."
        actions={[
          {
            label: "Add new about",
            icon: Plus,
            onClick: () => {
              setEditingAbout(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <AboutDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAbout(null);
          }
        }}
        about={editingAbout}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingAbout
            ? `Are you sure you want to delete this about section? This action cannot be undone.`
            : "Are you sure you want to delete this about section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingAbout?.label || "About section"}
        onConfirm={async () => {
          if (deletingAbout) {
            await deleteAbout(deletingAbout._id);
            setDeletingAbout(null);
          }
        }}
        onSuccess={() => {
          setDeletingAbout(null);
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
          {abouts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={FileText}
                  title="No about sections available"
                  description="No about sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={abouts}
                actions={actions}
                tableName="About Section"
                isLoading={isLoading}
                totalItems={abouts.length}
                itemsPerPage={abouts.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default AboutTemplate;

