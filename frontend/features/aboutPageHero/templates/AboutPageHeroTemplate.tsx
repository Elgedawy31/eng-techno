"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAboutPageHeroes } from "../hooks/useAboutPageHeroes";
import { useDeleteAboutPageHero } from "../hooks/useDeleteAboutPageHero";
import { useToggleActive } from "../hooks/useToggleActive";
import type { AboutPageHero } from "../services/aboutPageHeroService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, ImageIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AboutPageHeroDialog } from "../components/AboutPageHeroDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function AboutPageHeroTemplate() {
  const { aboutPageHeroes, isLoading, isError, error } = useAboutPageHeroes();
  const { deleteAboutPageHero } = useDeleteAboutPageHero();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAboutPageHero, setEditingAboutPageHero] = useState<AboutPageHero | null>(null);
  const [deletingAboutPageHero, setDeletingAboutPageHero] = useState<AboutPageHero | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get heroes with images for lightbox
  const heroesWithImages = aboutPageHeroes.filter((hero) => hero.backgroundImage);

  const columns: ColumnDef<AboutPageHero>[] = [
    {
      accessorKey: "backgroundImage",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("backgroundImage") as string;
        const hero = row.original;
        
        const handleImageClick = () => {
          if (imageUrl) {
            // Find the index in the filtered array
            const lightboxIdx = heroesWithImages.findIndex(
              (h) => h._id === hero._id
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
                alt="About page hero background"
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
  const actions: Action<AboutPageHero>[] = [
    {
      label: "Edit",
      onClick: (hero) => {
        setEditingAboutPageHero(hero);
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
        setDeletingAboutPageHero(hero);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="About Page Heroes"
        description="You can manage all about page hero sections here."
        actions={[
          {
            label: "Add new hero",
            icon: Plus,
            onClick: () => {
              setEditingAboutPageHero(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <AboutPageHeroDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAboutPageHero(null);
          }
        }}
        aboutPageHero={editingAboutPageHero}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingAboutPageHero
            ? `Are you sure you want to delete this about page hero section? This action cannot be undone.`
            : "Are you sure you want to delete this about page hero section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingAboutPageHero?.title}
        onConfirm={async () => {
          if (deletingAboutPageHero) {
            await deleteAboutPageHero(deletingAboutPageHero._id);
            setDeletingAboutPageHero(null);
          }
        }}
        onSuccess={() => {
          setDeletingAboutPageHero(null);
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
          {aboutPageHeroes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={ImageIcon}
                  title="No about page hero sections available"
                  description="No about page hero sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={aboutPageHeroes}
                actions={actions}
                tableName="About Page Hero Section"
                isLoading={isLoading}
                totalItems={aboutPageHeroes.length}
                itemsPerPage={aboutPageHeroes.length || 10}
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
        slides={heroesWithImages.map((hero) => ({
          src: hero.backgroundImage,
          alt: hero.title || "About page hero background",
        }))}
      />
    </section>
  );
}

export default AboutPageHeroTemplate;

