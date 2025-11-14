"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useCoreValuesSections } from "../hooks/useCoreValuesSections";
import { useDeleteCoreValuesSection } from "../hooks/useDeleteCoreValuesSection";
import { useToggleActive } from "../hooks/useToggleActive";
import type { CoreValuesSection } from "../services/coreValuesSectionService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Sparkles, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { CoreValuesSectionDialog } from "../components/CoreValuesSectionDialog";
import { Badge } from "@/components/ui/badge";

function CoreValuesSectionTemplate() {
  const { coreValuesSections, isLoading, isError, error } = useCoreValuesSections();
  const { deleteCoreValuesSection } = useDeleteCoreValuesSection();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoreValuesSection, setEditingCoreValuesSection] = useState<CoreValuesSection | null>(null);
  const [deletingCoreValuesSection, setDeletingCoreValuesSection] = useState<CoreValuesSection | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<CoreValuesSection>[] = [
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => {
        const label = row.getValue("label") as string | undefined;
        return (
          <div className="font-medium max-w-xs truncate">
            {label || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "heading",
      header: "Heading",
      cell: ({ row }) => {
        const heading = row.getValue("heading") as string;
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {heading}
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
  const actions: Action<CoreValuesSection>[] = [
    {
      label: "Edit",
      onClick: (section) => {
        setEditingCoreValuesSection(section);
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
        setDeletingCoreValuesSection(section);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Core Values Sections"
        description="You can manage all core values sections here."
        actions={[
          {
            label: "Add new section",
            icon: Plus,
            onClick: () => {
              setEditingCoreValuesSection(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <CoreValuesSectionDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCoreValuesSection(null);
          }
        }}
        coreValuesSection={editingCoreValuesSection}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingCoreValuesSection
            ? `Are you sure you want to delete this core values section? This action cannot be undone.`
            : "Are you sure you want to delete this core values section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingCoreValuesSection?.heading}
        onConfirm={async () => {
          if (deletingCoreValuesSection) {
            await deleteCoreValuesSection(deletingCoreValuesSection._id);
            setDeletingCoreValuesSection(null);
          }
        }}
        onSuccess={() => {
          setDeletingCoreValuesSection(null);
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
          {coreValuesSections.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Sparkles}
                  title="No core values sections available"
                  description="No core values sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={coreValuesSections}
                actions={actions}
                tableName="Core Values Section"
                isLoading={isLoading}
                totalItems={coreValuesSections.length}
                itemsPerPage={coreValuesSections.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default CoreValuesSectionTemplate;

