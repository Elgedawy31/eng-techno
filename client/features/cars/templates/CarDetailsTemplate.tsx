"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCarById } from "../hooks/useCar";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Edit, Car as CarIcon, Calendar, MapPin, Gauge, Fuel, Users, Settings2, DollarSign, FileText, Copy, Check } from "lucide-react";
import { getErrorMessage } from "@/utils/api.utils";
import { getImageUrl } from "@/utils/image.utils";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { useAuthStore } from "@/features/auth/stores/authStore";
import type { CarStatus } from "../types/car.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom as SwiperZoom, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/free-mode";

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

// Translate transmission to Arabic
const getTransmissionLabel = (transmission?: string): string => {
  const transmissionMap: Record<string, string> = {
    manual: "يدوي",
    automatic: "أوتوماتيك",
  };
  return transmissionMap[transmission || ""] || transmission || "-";
};

function CarDetailsTemplate() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const carId = params?.id as string | undefined;
  const { car, isLoading, isError, error } = useCarById(carId);
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [copiedChassisIndex, setCopiedChassisIndex] = React.useState<number | null>(null);

  if (isLoading) {
    return <UniLoading />;
  }

  if (isError || !car) {
    return (
      <Card>
        <CardContent className="pt-6">
          <NoDataMsg
            icon={AlertCircle}
            title="حدث خطأ"
            description={getErrorMessage(error) || "حدث خطأ أثناء جلب بيانات السيارة"}
            iconBgColor="bg-destructive/10"
            iconColor="text-destructive"
          />
        </CardContent>
      </Card>
    );
  }

  const images = car.images && car.images.length > 0 
    ? car.images.map(img => getImageUrl(img)).filter(Boolean) as string[]
    : [];

  const lightboxSlides = images.map((src) => ({ src }));

  const handleCopyChassis = async (chassis: string, index: number) => {
    try {
      await navigator.clipboard.writeText(chassis);
      setCopiedChassisIndex(index);
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedChassisIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${car.brandId.name} ${car.carNameId.name}`}
        description={`${car.gradeId.name} - ${car.yearId.value}`}
        actions={[
        
          ...(user?.role === "admin" ? [{
            label: "تعديل",
            icon: Edit,
            onClick: () => router.push(`/dashboard/cars/edit/${car._id}`),
            variant: "default" as const,
          },
          {
            label: "رجوع",
            icon: ArrowLeft,
            onClick: () => router.back(),
            variant: "secondary" as const,
          },] : []),
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery with Swiper */}
          <Card className="p-4">
            <CardContent className="p-0">
              {images.length > 0 ? (
                <>
                  {/* Main Swiper */}
                  <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden mb-4 group">
                    <Swiper
                      modules={[Navigation, Thumbs, SwiperZoom]}
                      thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                      navigation={images.length > 1 ? {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                      } : false}
                      zoom={true}
                      className="main-swiper h-full [&_.swiper-button-next]:text-primary [&_.swiper-button-prev]:text-primary [&_.swiper-button-next]:opacity-0 group-hover:[&_.swiper-button-next]:opacity-100 [&_.swiper-button-prev]:opacity-0 group-hover:[&_.swiper-button-prev]:opacity-100 [&_.swiper-button-next]:transition-opacity [&_.swiper-button-prev]:transition-opacity"
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={index} className="cursor-pointer">
                          <div className="swiper-zoom-container w-full h-full">
                            <Image
                              src={img}
                              alt={`${car.brandId.name} ${car.carNameId.name} - صورة ${index + 1}`}
                              fill
                              className="object-cover"
                              priority={index === 0}
                              onClick={() => {
                                setLightboxIndex(index);
                                setLightboxOpen(true);
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Thumbnails Swiper */}
                  {images.length > 1 && (
                    <div className="px-2">
                      <Swiper
                        modules={[FreeMode, Navigation, Thumbs]}
                        onSwiper={setThumbsSwiper}
                        spaceBetween={8}
                        slidesPerView="auto"
                        freeMode={true}
                        watchSlidesProgress={true}
                        className="thumbs-swiper"
                      >
                        {images.map((img, index) => (
                          <SwiperSlide
                            key={index}
                            className="w-auto cursor-pointer"
                            style={{ width: "auto" }}
                          >
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
                              <Image
                                src={img}
                                alt={`صورة ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

                  {/* Lightbox */}
                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={lightboxSlides}
                    plugins={[Zoom]}
                    controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
                  />
                </>
              ) : (
                <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                  <CarIcon className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {car.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  الوصف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Chassis Numbers */}
          {car.chassis && car.chassis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  أرقام الشاسيه ({car.chassis.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto p-1">
                  {car.chassis.map((chassis, index) => {
                    const isCopied = copiedChassisIndex === index;
                    return (
                      <div
                        key={index}
                        className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card hover:bg-muted/50 transition-all"
                      >
                        <span className="font-mono text-xs text-foreground select-all pr-1">
                          {chassis}
                        </span>
                        <button
                          onClick={() => handleCopyChassis(chassis, index)}
                          disabled={isCopied}
                          className={`shrink-0 p-1 rounded transition-all ${
                            isCopied
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          } disabled:cursor-default`}
                          title={isCopied ? "تم النسخ" : "نسخ"}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Status and Pricing */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  السعر والحالة
                </CardTitle>
                <Badge variant={getStatusVariant(car.status)}>
                  {getStatusLabel(car.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">السعر النقدي</span>
                  <span className="text-lg font-semibold text-primary">
                    {car.priceCash.toLocaleString()} ر.س
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">السعر بالتقسيط</span>
                  <span className="text-lg font-semibold text-primary">
                    {car.priceFinance.toLocaleString()} ر.س
                  </span>
                </div>
              </div>
              {car.reservedBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">محجوز بواسطة:</p>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="font-medium">{car.reservedBy.name}</p>
                    <p className="text-sm text-muted-foreground">{car.reservedBy.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">الماركة</span>
                <span className="font-medium">{car.brandId.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">اسم السيارة</span>
                <span className="font-medium">{car.carNameId.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">الوكيل</span>
                <span className="font-medium">{car.agentId?.name || "-"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">الدرجة</span>
                <span className="font-medium">{car.gradeId.name}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">السنة</span>
                <span className="font-medium">{car.yearId.value}</span>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                المواصفات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {car.engine_capacity && (
                <div className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    سعة المحرك
                  </span>
                  <span className="font-medium">{car.engine_capacity} لتر</span>
                </div>
              )}
              {car.transmission && (
                <div className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    ناقل الحركة
                  </span>
                  <span className="font-medium">{getTransmissionLabel(car.transmission)}</span>
                </div>
              )}
              {car.fuel_capacity && (
                <div className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    سعة الوقود
                  </span>
                  <span className="font-medium">{car.fuel_capacity} لتر</span>
                </div>
              )}
              {car.seat_type && (
                <div className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    نوع المقاعد
                  </span>
                  <span className="font-medium">{car.seat_type}</span>
                </div>
              )}
              {car.location && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    الموقع
                  </span>
                  <span className="font-medium">{car.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          {(car.internalColors && car.internalColors.length > 0) || 
           (car.externalColors && car.externalColors.length > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  الألوان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {car.internalColors && car.internalColors.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الألوان الداخلية</p>
                    <div className="flex flex-wrap gap-2">
                      {car.internalColors.map((color, index) => (
                        <Badge key={index} variant="secondary">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {car.externalColors && car.externalColors.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الألوان الخارجية</p>
                    <div className="flex flex-wrap gap-2">
                      {car.externalColors.map((color, index) => (
                        <Badge key={index} variant="outline">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
                <span className="font-medium text-sm">
                  {dayjs(car.createdAt).format("DD MMMM YYYY")}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">آخر تحديث</span>
                <span className="font-medium text-sm">
                  {dayjs(car.updatedAt).format("DD MMMM YYYY")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CarDetailsTemplate;
