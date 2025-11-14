"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useComplianceQualities } from "../hooks/useComplianceQualities";
import { useDeleteComplianceQuality } from "../hooks/useDeleteComplianceQuality";
import { useToggleActive } from "../hooks/useToggleActive";
import type { ComplianceQuality } from "../services/complianceQualityService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, ShieldCheck, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { ComplianceQualityDialog } from "../components/ComplianceQualityDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function ComplianceQualityTemplate() {
  const { complianceQualities, isLoading, isError, error } = useComplianceQualities();
  const { deleteComplianceQuality } = useDeleteComplianceQuality();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComplianceQuality, setEditingComplianceQuality] = useState<ComplianceQuality | null>(null);
  const [deletingComplianceQuality, setDeletingComplianceQuality] = useState<ComplianceQuality | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get all images for lightbox
  const allImages = complianceQualities.flatMap((cq) => [
    cq.logoImage,
    cq.displayImage,
  ].filter(Boolean));

  const columns: ColumnDef<ComplianceQuality>[] = [
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
      accessorKey: "firstDescription",
      header: "First Description",
      cell: ({ row }) => {
        const description = row.getValue("firstDescription") as string;
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
  const actions: Action<ComplianceQuality>[] = [
    {
      label: "Edit",
      onClick: (complianceQuality) => {
        setEditingComplianceQuality(complianceQuality);
        setIsDialogOpen(true);
      },
    },
    {
      label: (complianceQuality) => (complianceQuality.isActive ? "Deactivate" : "Activate"),
      onClick: async (complianceQuality) => {
        await toggleActive(complianceQuality._id);
      },
    },
    {
      label: "Delete",
      onClick: (complianceQuality) => {
        setDeletingComplianceQuality(complianceQuality);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Compliance & Quality Sections"
        description="You can manage all compliance & quality sections here."
        actions={[
          {
            label: "Add new section",
            icon: Plus,
            onClick: () => {
              setEditingComplianceQuality(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <ComplianceQualityDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingComplianceQuality(null);
          }
        }}
        complianceQuality={editingComplianceQuality}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingComplianceQuality
            ? `Are you sure you want to delete this compliance & quality section? This action cannot be undone.`
            : "Are you sure you want to delete this compliance & quality section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingComplianceQuality?.title}
        onConfirm={async () => {
          if (deletingComplianceQuality) {
            await deleteComplianceQuality(deletingComplianceQuality._id);
            setDeletingComplianceQuality(null);
          }
        }}
        onSuccess={() => {
          setDeletingComplianceQuality(null);
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
          {complianceQualities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={ShieldCheck}
                  title="No compliance & quality sections available"
                  description="No compliance & quality sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={complianceQualities}
                actions={actions}
                tableName="Compliance & Quality Section"
                isLoading={isLoading}
                totalItems={complianceQualities.length}
                itemsPerPage={complianceQualities.length || 10}
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
          alt: "Compliance & Quality image",
        }))}
      />
    </section>
  );
}

export default ComplianceQualityTemplate;

