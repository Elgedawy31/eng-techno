"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useFooters } from "../hooks/useFooters";
import { useDeleteFooter } from "../hooks/useDeleteFooter";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Footer } from "../services/footerService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Footprints, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { FooterDialog } from "../components/FooterDialog";
import { Badge } from "@/components/ui/badge";

function FooterTemplate() {
  const { footers, isLoading, isError, error } = useFooters();
  const { deleteFooter } = useDeleteFooter();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFooter, setEditingFooter] = useState<Footer | null>(null);
  const [deletingFooter, setDeletingFooter] = useState<Footer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<Footer>[] = [
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
      accessorKey: "subtitle",
      header: "Subtitle",
      cell: ({ row }) => {
        const subtitle = row.getValue("subtitle") as string;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {subtitle}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.getValue("email")}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.getValue("phone")}
          </div>
        );
      },
    },
    {
      accessorKey: "officeLocations",
      header: "Office Locations",
      cell: ({ row }) => {
        const locations = row.getValue("officeLocations") as string;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {locations}
          </div>
        );
      },
    },
    {
      accessorKey: "buttonText",
      header: "Button Text",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {row.getValue("buttonText")}
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
  const actions: Action<Footer>[] = [
    {
      label: "Edit",
      onClick: (footer) => {
        setEditingFooter(footer);
        setIsDialogOpen(true);
      },
    },
    {
      label: (footer) => (footer.isActive ? "Deactivate" : "Activate"),
      onClick: async (footer) => {
        await toggleActive(footer._id);
      },
    },
    {
      label: "Delete",
      onClick: (footer) => {
        setDeletingFooter(footer);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Footer"
        description="You can manage the footer here. Only one footer can exist (singleton pattern)."
        actions={[
          {
            label: footers.length > 0 ? "Update Footer" : "Create Footer",
            icon: Plus,
            onClick: () => {
              setEditingFooter(footers.length > 0 ? footers[0] : null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <FooterDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingFooter(null);
          }
        }}
        footer={editingFooter}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingFooter
            ? `Are you sure you want to delete this footer? This action cannot be undone.`
            : "Are you sure you want to delete this footer? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingFooter?.mainTitle}
        onConfirm={async () => {
          if (deletingFooter) {
            await deleteFooter(deletingFooter._id);
            setDeletingFooter(null);
          }
        }}
        onSuccess={() => {
          setDeletingFooter(null);
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
          {footers.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Footprints}
                  title="No footer available"
                  description="No footer has been created yet. Click 'Create Footer' to add one."
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={footers}
                actions={actions}
                tableName="Footer"
                isLoading={isLoading}
                totalItems={footers.length}
                itemsPerPage={footers.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default FooterTemplate;

