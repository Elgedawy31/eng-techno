"use client";

import {  useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useCars, type CarFilters } from "../hooks/useCar";
import type { Car, CarStatus } from "../types/car.types";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, Car as CarIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils/image.utils";
import Image from "next/image";
import { CarsFilter } from "../components/CarsFilter";
import { useAuthStore } from "@/features/auth/stores/authStore";

dayjs.locale("ar");

// Translate status to Arabic
const getStatusLabel = (status: CarStatus): string => {
  const statusMap: Record<CarStatus, string> = {
    available: "متاح",
    reserved: "محجوز",
    sold: "مباع",
    maintenance: "صيانة",
  };
  return statusMap[status] || status;
};

// Get status badge variant
const getStatusVariant = (status: CarStatus): "default" | "secondary" | "destructive" | "outline" => {
  const variantMap: Record<CarStatus, "default" | "secondary" | "destructive" | "outline"> = {
    available: "default",
    reserved: "secondary",
    sold: "destructive",
    maintenance: "outline",
  };
  return variantMap[status] || "default";
};

function CarsTemplate() {
  const router = useRouter();
  const {user} = useAuthStore()
  const [filters, setFilters] = useState<CarFilters>({});
  const { cars, isLoading, isError, error, pagination, page, setPage, deleteCar } = useCars(1, 10, filters);
  const [deletingCar, setDeletingCar] = useState<Car | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleFiltersChange = useCallback((changes: Partial<CarFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...changes };
      return next;
    });
    // Reset to first page whenever filters change
    setPage(1);
  }, [setPage]);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, [setPage]);

  // Define columns
  const columns: ColumnDef<Car>[] = [
    {
      accessorKey: "images",
      header: "الصورة",
      cell: ({ row }) => {
        const car = row.original;
        const firstImage = car.images && car.images.length > 0 ? car.images[0] : null;
        const imageUrl = firstImage ? getImageUrl(firstImage) : null;
        return (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${car.brandId.name} ${car.carNameId.name}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CarIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "brandId",
      header: "الماركة",
      cell: ({ row }) => {
        const car = row.original;
        return <div className="font-medium">{car.brandId.name}</div>;
      },
    },
    {
      accessorKey: "carNameId",
      header: "اسم السيارة",
      cell: ({ row }) => {
        const car = row.original;
        return <div className="font-medium">{car.carNameId.name}</div>;
      },
    },
    {
      accessorKey: "agentId",
      header: "الوكيل",
      cell: ({ row }) => {
        const car = row.original;
        return (
          <div className="text-muted-foreground">
            {car.agentId?.name || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "gradeId",
      header: "الدرجة",
      cell: ({ row }) => {
        const car = row.original;
        return <div className="text-muted-foreground">{car.gradeId.name}</div>;
      },
    },
    {
      accessorKey: "yearId",
      header: "السنة",
      cell: ({ row }) => {
        const car = row.original;
        return <div className="text-muted-foreground">{car.yearId.value}</div>;
      },
    },
    {
      accessorKey: "chassis",
      header: "أرقام الشاسيه",
      cell: ({ row }) => {
        const car = row.original;
        const chassisCount = car.chassis?.length || 0;
        return (
          <div className="text-muted-foreground">
            {chassisCount > 0 ? `${chassisCount} رقم` : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "priceCash",
      header: "السعر النقدي",
      cell: ({ row }) => {
        const car = row.original;
        return (
          <div className="font-medium">
            {car.priceCash.toLocaleString()} ر.س
          </div>
        );
      },
    },
    {
      accessorKey: "priceFinance",
      header: "السعر بالتقسيط",
      cell: ({ row }) => {
        const car = row.original;
        return (
          <div className="font-medium">
            {car.priceFinance.toLocaleString()} ر.س
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const car = row.original;
        const variant = getStatusVariant(car.status);
        return (
          <Badge variant={variant}>
            {getStatusLabel(car.status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإنشاء",
      cell: ({ row }) => {
        const car = row.original;
        return (
          <div className="text-muted-foreground">
            {dayjs(car.createdAt).format("DD MMMM YYYY")}
          </div>
        );
      },
    },
  ];

  // Define actions
  const actions: Action<Car>[] = [
    {
      label: "Details",
      onClick: (car) => {
        router.push(`/dashboard/cars/${car._id}`);
      },
    },
    {
      label: "Edit",
      onClick: (car) => {
        router.push(`/dashboard/cars/edit/${car._id}`);
      },
    },
    {
      label: "Delete",
      onClick: (car) => {
        setDeletingCar(car);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <section className="flex-1 space-y-6">
        <PageHeader
          title="السيارات"
          description="يمكنك إدارة جميع السيارات من هنا."
            actions={user?.role === "admin" ? [
              {
                label: "إضافة سيارة جديدة",
                icon: Plus,
                onClick: () => router.push("/dashboard/cars/new"),
                variant: "default",
              },
            ] : []}
        />

        <ConfirmationModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="تأكيد الحذف"
          description={
            deletingCar
              ? `هل أنت متأكد من حذف السيارة "${deletingCar.brandId.name} ${deletingCar.carNameId.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : "هل أنت متأكد من حذف هذه السيارة؟ لا يمكن التراجع عن هذا الإجراء."
          }
          confirmText="حذف"
          cancelText="إلغاء"
          variant="destructive"
          itemType="حذف"
          itemName={deletingCar ? `${deletingCar.brandId.name} ${deletingCar.carNameId.name}` : undefined}
          onConfirm={async () => {
            if (deletingCar) {
              await deleteCar(deletingCar._id);
              setDeletingCar(null);
            }
          }}
          onSuccess={() => {
            setDeletingCar(null);
          }}
        />

        <div className="flex gap-6">
          <div className="space-y-6 flex-1">
            {isLoading && <UniLoading />}

            {!isLoading && isError && (
              <Card>
                <CardContent className="pt-6">
                  <NoDataMsg
                    icon={AlertCircle}
                    title="حدث خطأ"
                    description={getErrorMessage(error) || "حدث خطأ أثناء جلب البيانات"}
                    iconBgColor="bg-destructive/10"
                    iconColor="text-destructive"
                  />
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && (
              <>
                {cars.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <NoDataMsg
                        icon={CarIcon}
                        title="لا يوجد سيارات متاحة"
                        description="لم يتم إضافة أي سيارات حتى الآن"
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="p-6">
                    <UniTable
                      columns={columns}
                      data={cars}
                      actions={actions}
                      totalItems={pagination?.total || 0}
                      itemsPerPage={pagination?.limit || 10}
                      currentPage={page}
                      onPageChange={setPage}
                      tableName="سيارة"
                      isLoading={isLoading}
                    />
                  </Card>
                )}
              </>
            )}
          </div>
          <CarsFilter
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleResetFilters}
            disabled={isLoading}
          />
        </div>
      </section>

     
    </div>
  );
}

export default CarsTemplate;
