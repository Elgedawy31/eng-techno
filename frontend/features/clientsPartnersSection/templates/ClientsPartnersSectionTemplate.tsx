"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useClientsPartnersSections } from "../hooks/useClientsPartnersSections";
import { useDeleteClientsPartnersSection } from "../hooks/useDeleteClientsPartnersSection";
import { useToggleActive } from "../hooks/useToggleActive";
import type { ClientsPartnersSection } from "../services/clientsPartnersSectionService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Users, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { ClientsPartnersSectionDialog } from "../components/ClientsPartnersSectionDialog";
import { Badge } from "@/components/ui/badge";

function ClientsPartnersSectionTemplate() {
  const { clientsPartnersSections, isLoading, isError, error } = useClientsPartnersSections();
  const { deleteClientsPartnersSection } = useDeleteClientsPartnersSection();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClientsPartnersSection, setEditingClientsPartnersSection] = useState<ClientsPartnersSection | null>(null);
  const [deletingClientsPartnersSection, setDeletingClientsPartnersSection] = useState<ClientsPartnersSection | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<ClientsPartnersSection>[] = [
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
  const actions: Action<ClientsPartnersSection>[] = [
    {
      label: "Edit",
      onClick: (section) => {
        setEditingClientsPartnersSection(section);
        setIsDialogOpen(true);
      },
    },
    {
      label: (section) => (section.isActive ? "Deactivate" : "Activate"),
      onClick: async (section) => {
        await toggleActive(section._id);
      },
    },
    {
      label: "Delete",
      onClick: (section) => {
        setDeletingClientsPartnersSection(section);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Clients & Partners Sections"
        description="You can manage all clients & partners sections here."
        actions={[
          {
            label: "Add new section",
            icon: Plus,
            onClick: () => {
              setEditingClientsPartnersSection(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <ClientsPartnersSectionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingClientsPartnersSection(null);
          }
        }}
        clientsPartnersSection={editingClientsPartnersSection}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingClientsPartnersSection
            ? `Are you sure you want to delete this clients & partners section? This action cannot be undone.`
            : "Are you sure you want to delete this clients & partners section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingClientsPartnersSection?.title}
        onConfirm={async () => {
          if (deletingClientsPartnersSection) {
            await deleteClientsPartnersSection(deletingClientsPartnersSection._id);
            setDeletingClientsPartnersSection(null);
          }
        }}
        onSuccess={() => {
          setDeletingClientsPartnersSection(null);
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
          {clientsPartnersSections.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Users}
                  title="No clients & partners sections available"
                  description="No clients & partners sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={clientsPartnersSections}
                actions={actions}
                tableName="Clients & Partners Section"
                isLoading={isLoading}
                totalItems={clientsPartnersSections.length}
                itemsPerPage={clientsPartnersSections.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default ClientsPartnersSectionTemplate;

