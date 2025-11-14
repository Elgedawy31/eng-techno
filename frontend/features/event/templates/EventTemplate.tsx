"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useEvents } from "../hooks/useEvents";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import { useToggleActive } from "../hooks/useToggleActive";
import type { Event } from "../services/eventService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Calendar, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { EventDialog } from "../components/EventDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

function EventTemplate() {
  const { events, isLoading, isError, error } = useEvents();
  const { deleteEvent } = useDeleteEvent();
  const { toggleActive } = useToggleActive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{ src: string; alt: string }>>([]);

  // Prepare all images for lightbox
  const allEventImages: Array<{ src: string; alt: string; eventId: string }> = [];
  events.forEach((event) => {
    if (event.eventLogoImage) {
      allEventImages.push({
        src: event.eventLogoImage,
        alt: event.title || "Event logo",
        eventId: event._id,
      });
    }
    event.displayImages?.forEach((img, idx) => {
      allEventImages.push({
        src: img,
        alt: `${event.title} - Display ${idx + 1}`,
        eventId: event._id,
      });
    });
  });

  const handleImageClick = (event: Event, imageUrl: string, isLogo: boolean) => {
    const eventImages: Array<{ src: string; alt: string }> = [];
    if (event.eventLogoImage) {
      eventImages.push({ src: event.eventLogoImage, alt: event.title || "Event logo" });
    }
    event.displayImages?.forEach((img, idx) => {
      eventImages.push({ src: img, alt: `${event.title} - Display ${idx + 1}` });
    });
    
    const clickedIndex = eventImages.findIndex((img) => img.src === imageUrl);
    if (clickedIndex !== -1) {
      setLightboxImages(eventImages);
      setLightboxIndex(clickedIndex);
      setLightboxOpen(true);
    }
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "eventLogoImage",
      header: "Logo",
      cell: ({ row }) => {
        const imageUrl = row.getValue("eventLogoImage") as string | undefined;
        const event = row.original;
        
        return (
          <div 
            className={cn(
              "w-20 h-20 rounded-lg overflow-hidden border border-border",
              imageUrl && "cursor-pointer hover:opacity-80 transition-opacity"
            )}
            onClick={() => imageUrl && handleImageClick(event, imageUrl, true)}
          >
            {imageUrl ? (
              <Image
                width={80}
                height={80}
                src={imageUrl}
                alt="Event logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Calendar className="w-6 h-6 text-muted-foreground" />
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
      accessorKey: "shortDescription",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground max-w-xs truncate">
            {row.getValue("shortDescription")}
          </div>
        );
      },
    },
    {
      accessorKey: "displayImages",
      header: "Display Images",
      cell: ({ row }) => {
        const images = row.getValue("displayImages") as string[];
        const event = row.original;
        return (
          <div className="flex gap-2">
            {images && images.length > 0 ? (
              images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleImageClick(event, img, false)}
                >
                  <Image
                    width={48}
                    height={48}
                    src={img}
                    alt={`Display ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No images</span>
            )}
            {images && images.length > 3 && (
              <div className="w-12 h-12 rounded border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{images.length - 3}
              </div>
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
  const actions: Action<Event>[] = [
    {
      label: "Edit",
      onClick: (event) => {
        setEditingEvent(event);
        setIsDialogOpen(true);
      },
    },
    {
      label: (event) => (event.isActive ? "Deactivate" : "Activate"),
      onClick: async (event) => {
        await toggleActive(event._id);
      },
    },
    {
      label: "Delete",
      onClick: (event) => {
        setDeletingEvent(event);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="Events"
        description="You can manage all events here."
        actions={[
          {
            label: "Add new event",
            icon: Plus,
            onClick: () => {
              setEditingEvent(null);
              setIsDialogOpen(true);
            },
            variant: "default",
          },
        ]}
      />

      <EventDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingEvent(null);
          }
        }}
        event={editingEvent}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm deletion"
        description={
          deletingEvent
            ? `Are you sure you want to delete this event? This action cannot be undone.`
            : "Are you sure you want to delete this event? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
        itemName={deletingEvent?.title}
        onConfirm={async () => {
          if (deletingEvent) {
            await deleteEvent(deletingEvent._id);
            setDeletingEvent(null);
          }
        }}
        onSuccess={() => {
          setDeletingEvent(null);
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
          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={Calendar}
                  title="No events available"
                  description="No events have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
                columns={columns}
                data={events}
                actions={actions}
                tableName="Event"
                isLoading={isLoading}
                totalItems={events.length}
                itemsPerPage={events.length || 10}
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
        slides={lightboxImages}
      />
    </section>
  );
}

export default EventTemplate;

