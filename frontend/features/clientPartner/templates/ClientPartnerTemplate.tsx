"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAllClientPartners } from "../hooks/useAllClientPartners";
import { useDeleteClientPartner } from "../hooks/useDeleteClientPartner";
import { useToggleActive } from "../hooks/useToggleActive";
import type { ClientPartner } from "../services/clientPartnerService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Users, Plus, ImageIcon } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { ClientPartnerDialog } from "../components/ClientPartnerDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function ClientPartnerTemplate() {
  const { allClientPartners, isLoading, isError, error } = useAllClientPartners();
  const { deleteClientPartner } = useDeleteClientPartner();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClientPartner, setEditingClientPartner] = useState<ClientPartner | null>(null);
  const [deletingClientPartner, setDeletingClientPartner] = useState<ClientPartner | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get partners with images for lightbox
  const partnersWithImages = allClientPartners.filter((partner) => partner.emblemImage);

  const columns: ColumnDef<ClientPartner>[] = [
    {
      accessorKey: "emblemImage",
      header: "Emblem",
      cell: ({ row }) => {
        const imageUrl = row.getValue("emblemImage") as string | undefined;
        const partner = row.original;
        
        const handleImageClick = () => {
          if (imageUrl) {
            const lightboxIdx = partnersWithImages.findIndex(
              (p) => p._id === partner._id
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
                alt={partner.name || "Client partner emblem"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string | undefined;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {description || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => {
        return <div className="text-sm font-medium">{row.getValue("order")}</div>;
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
  const actions: Action<ClientPartner>[] = [
    {
      label: "Edit",
      onClick: (partner) => {
        setEditingClientPartner(partner);
        setIsDialogOpen(true);
      },
    },
    {
      label: (partner) => (partner.isActive ? "Deactivate" : "Activate"),
      onClick: async (partner) => {
        await toggleActive(partner._id);
      },
    },
    {
      label: "Delete",
      onClick: (partner) => {
        setDeletingClientPartner(partner);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Client Partners"
        description="You can manage all client partners here."
        actions={[
          {
            label: "Add new client partner",
            icon: Plus,
            onClick: () => {
              setEditingClientPartner(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <ClientPartnerDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingClientPartner(null);
          }
        }}
        clientPartner={editingClientPartner}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingClientPartner
            ? `Are you sure you want to delete this client partner? This action cannot be undone.`
            : "Are you sure you want to delete this client partner? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingClientPartner?.name}
        onConfirm={async () => {
          if (deletingClientPartner) {
            await deleteClientPartner(deletingClientPartner._id);
            setDeletingClientPartner(null);
          }
        }}
        onSuccess={() => {
          setDeletingClientPartner(null);
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
          {allClientPartners.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Users}
                  title="No client partners available"
                  description="No client partners have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={allClientPartners}
                actions={actions}
                tableName="Client Partner"
                isLoading={isLoading}
                totalItems={allClientPartners.length}
                itemsPerPage={allClientPartners.length || 10}
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
        slides={partnersWithImages.map((partner) => ({
          src: partner.emblemImage!,
          alt: partner.name || "Client partner emblem",
        }))}
      />
    </section>
  );
}

export default ClientPartnerTemplate;

