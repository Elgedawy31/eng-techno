"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useAboutPageContents } from "../hooks/useAboutPageContents";
import { useDeleteAboutPageContent } from "../hooks/useDeleteAboutPageContent";
import { useToggleActive } from "../hooks/useToggleActive";
import type { AboutPageContent } from "../services/aboutPageContentService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, FileText, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AboutPageContentDialog } from "../components/AboutPageContentDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function AboutPageContentTemplate() {
  const { aboutPageContents, isLoading, isError, error } = useAboutPageContents();
  const { deleteAboutPageContent } = useDeleteAboutPageContent();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAboutPageContent, setEditingAboutPageContent] = useState<AboutPageContent | null>(null);
  const [deletingAboutPageContent, setDeletingAboutPageContent] = useState<AboutPageContent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Get contents with images for lightbox
  const contentsWithImages = aboutPageContents.filter((content) => content.backgroundImage || content.logoImage);

  const columns: ColumnDef<AboutPageContent>[] = [
    {
      accessorKey: "backgroundImage",
      header: "Background Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("backgroundImage") as string;
        const content = row.original;
        
        const handleImageClick = () => {
          if (imageUrl) {
            const allImages = contentsWithImages.flatMap((c) => [
              c.backgroundImage,
              c.logoImage,
            ].filter(Boolean));
            const lightboxIdx = allImages.findIndex((url) => url === imageUrl);
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
                alt="Background"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <FileText className="w-6 h-6 text-muted-foreground" />
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
  const actions: Action<AboutPageContent>[] = [
    {
      label: "Edit",
      onClick: (content) => {
        setEditingAboutPageContent(content);
        setIsDialogOpen(true);
      },
    },
    {
      label: (content) => (content.isActive ? "Deactivate" : "Activate"),
      onClick: async (content) => {
        await toggleActive(content._id);
      },
    },
    {
      label: "Delete",
      onClick: (content) => {
        setDeletingAboutPageContent(content);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="About Page Contents"
        description="You can manage all about page content sections here."
        actions={[
          {
            label: "Add new content",
            icon: Plus,
            onClick: () => {
              setEditingAboutPageContent(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <AboutPageContentDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingAboutPageContent(null);
          }
        }}
        aboutPageContent={editingAboutPageContent}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingAboutPageContent
            ? `Are you sure you want to delete this about page content section? This action cannot be undone.`
            : "Are you sure you want to delete this about page content section? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingAboutPageContent?.headline}
        onConfirm={async () => {
          if (deletingAboutPageContent) {
            await deleteAboutPageContent(deletingAboutPageContent._id);
            setDeletingAboutPageContent(null);
          }
        }}
        onSuccess={() => {
          setDeletingAboutPageContent(null);
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
          {aboutPageContents.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={FileText}
                  title="No about page content sections available"
                  description="No about page content sections have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={aboutPageContents}
                actions={actions}
                tableName="About Page Content Section"
                isLoading={isLoading}
                totalItems={aboutPageContents.length}
                itemsPerPage={aboutPageContents.length || 10}
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
        slides={contentsWithImages.flatMap((content) => [
          content.backgroundImage && { src: content.backgroundImage, alt: content.headline || "Background" },
          content.logoImage && { src: content.logoImage, alt: content.headline || "Logo" },
        ].filter(Boolean))}
      />
    </section>
  );
}

export default AboutPageContentTemplate;

