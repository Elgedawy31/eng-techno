"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useServices } from "../hooks/useServices";
import { useDeleteService } from "../hooks/useDeleteService";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Service } from "../services/serviceService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, ImageIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { ServiceDialog } from "../components/ServiceDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function ServiceTemplate() {
  const { services, isLoading, isError, error } = useServices();
  const { deleteService } = useDeleteService();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get services with images for lightbox
  const servicesWithImages = services.filter((service) => service.backgroundImage);

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "backgroundImage",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("backgroundImage") as string;
        const service = row.original;
        
        const handleImageClick = () => {
          if (imageUrl) {
            const lightboxIdx = servicesWithImages.findIndex(
              (s) => s._id === service._id
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
                alt="Service background"
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
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {row.getValue("description")}
          </div>
        );
      },
    },
    {
      accessorKey: "categoryTags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("categoryTags") as string[];
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {tags && tags.length > 0 ? (
              tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No tags</span>
            )}
            {tags && tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("order")}</div>;
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
  const actions: Action<Service>[] = [
    {
      label: "Edit",
      onClick: (service) => {
        setEditingService(service);
        setIsDialogOpen(true);
      },
    },
    {
      label: (service) => (service.isActive ? "Deactivate" : "Activate"),
      onClick: async (service) => {
        await toggleActive(service._id);
      },
    },
    {
      label: "Delete",
      onClick: (service) => {
        setDeletingService(service);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Services"
        description="You can manage all services here."
        actions={[
          {
            label: "Add new service",
            icon: Plus,
            onClick: () => {
              setEditingService(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingService(null);
          }
        }}
        service={editingService}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingService
            ? `Are you sure you want to delete this service? This action cannot be undone.`
            : "Are you sure you want to delete this service? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingService?.title}
        onConfirm={async () => {
          if (deletingService) {
            await deleteService(deletingService._id);
            setDeletingService(null);
          }
        }}
        onSuccess={() => {
          setDeletingService(null);
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
          {services.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={ImageIcon}
                  title="No services available"
                  description="No services have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={services}
                actions={actions}
                tableName="Service"
                isLoading={isLoading}
                totalItems={services.length}
                itemsPerPage={services.length || 10}
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
        slides={servicesWithImages.map((service) => ({
          src: service.backgroundImage,
          alt: service.title || "Service background",
        }))}
      />
    </section>
  );
}

export default ServiceTemplate;

