"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAllCoreValues } from "../hooks/useAllCoreValues";
import { useDeleteCoreValue } from "../hooks/useDeleteCoreValue";
import { useToggleActive } from "../hooks/useToggleActive";
import type { CoreValue } from "../services/coreValueService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Sparkles, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { CoreValueDialog } from "../components/CoreValueDialog";
import { Badge } from "@/components/ui/badge";

function CoreValueTemplate() {
  const { allCoreValues, isLoading, isError, error } = useAllCoreValues();
  const { deleteCoreValue } = useDeleteCoreValue();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoreValue, setEditingCoreValue] = useState<CoreValue | null>(null);
  const [deletingCoreValue, setDeletingCoreValue] = useState<CoreValue | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<CoreValue>[] = [
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => {
        return <div className="text-sm font-medium">{row.getValue("order")}</div>;
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
  const actions: Action<CoreValue>[] = [
    {
      label: "Edit",
      onClick: (coreValue) => {
        setEditingCoreValue(coreValue);
        setIsDialogOpen(true);
      },
    },
    {
      label: (coreValue) => (coreValue.isActive ? "Deactivate" : "Activate"),
      onClick: async (coreValue) => {
        await toggleActive(coreValue._id);
      },
    },
    {
      label: "Delete",
      onClick: (coreValue) => {
        setDeletingCoreValue(coreValue);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Core Values"
        description="You can manage all core values here."
        actions={[
          {
            label: "Add new core value",
            icon: Plus,
            onClick: () => {
              setEditingCoreValue(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <CoreValueDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCoreValue(null);
          }
        }}
        coreValue={editingCoreValue}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingCoreValue
            ? `Are you sure you want to delete this core value? This action cannot be undone.`
            : "Are you sure you want to delete this core value? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingCoreValue?.title}
        onConfirm={async () => {
          if (deletingCoreValue) {
            await deleteCoreValue(deletingCoreValue._id);
            setDeletingCoreValue(null);
          }
        }}
        onSuccess={() => {
          setDeletingCoreValue(null);
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
          {allCoreValues.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Sparkles}
                  title="No core values available"
                  description="No core values have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={allCoreValues}
                actions={actions}
                tableName="Core Value"
                isLoading={isLoading}
                totalItems={allCoreValues.length}
                itemsPerPage={allCoreValues.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default CoreValueTemplate;

