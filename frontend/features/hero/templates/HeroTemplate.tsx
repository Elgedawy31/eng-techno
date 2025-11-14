"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useHeroes } from "../hooks/useHeroes";
import { useDeleteHero } from "../hooks/useDeleteHero";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Hero } from "../services/heroService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, ImageIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { HeroDialog } from "../components/HeroDialog";
import { Badge } from "@/components/ui/badge";

function HeroTemplate() {
  const { heroes, isLoading, isError, error } = useHeroes();
  const { deleteHero } = useDeleteHero();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [deletingHero, setDeletingHero] = useState<Hero | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<Hero>[] = [
    {
      accessorKey: "backgroundImage",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("backgroundImage") as string;
        return (
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Hero background"
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
      accessorKey: "headline",
      header: "Headline",
      cell: ({ row }) => {
        return (
          <div className="font-medium max-w-xs truncate">
            {row.getValue("headline")}
          </div>
        );
      },
    },
    {
      accessorKey: "subtitle",
      header: "Subtitle",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {row.getValue("subtitle")}
          </div>
        );
      },
    },
    {
      accessorKey: "buttonText",
      header: "Button Text",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("buttonText")}</div>;
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
  const actions: Action<Hero>[] = [
    {
      label: "Edit",
      onClick: (hero) => {
        setEditingHero(hero);
        setIsDialogOpen(true);
      },
    },
    {
      label: (hero) => (hero.isActive ? "Deactivate" : "Activate"),
      onClick: async (hero) => {
        await toggleActive(hero._id);
      },
    },
    {
      label: "Delete",
      onClick: (hero) => {
        setDeletingHero(hero);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Hero Sections"
        description="You can manage all hero sections here."
        actions={[
          {
            label: "Add new hero",
            icon: Plus,
            onClick: () => {
              setEditingHero(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <HeroDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingHero(null);
          }
        }}
        hero={editingHero}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingHero
            ? `Are you sure you want to delete this hero section? This action cannot be undone.`
            : "Are you sure you want to delete this hero section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingHero?.headline}
        onConfirm={async () => {
          if (deletingHero) {
            await deleteHero(deletingHero._id);
            setDeletingHero(null);
          }
        }}
        onSuccess={() => {
          setDeletingHero(null);
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
          {heroes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={ImageIcon}
                  title="No hero sections available"
                  description="No hero sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={heroes}
                actions={actions}
                tableName="Hero Section"
                isLoading={isLoading}
                totalItems={heroes.length}
                itemsPerPage={heroes.length || 10}
              />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default HeroTemplate;

