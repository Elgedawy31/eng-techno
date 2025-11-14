"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useBanners } from "../hooks/useBanners";
import type { Banner } from "../services/bannerService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ImageIcon, AlertCircleIcon, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { BannerPagination } from "../components/BannerPagination";
import { AddBannerDialog } from "../components/AddBannerDialog";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useDeleteBanner } from "../hooks/useDeleteBanner";
import { getImageUrl } from "@/utils/image.utils";
import { getErrorMessage } from "@/utils/api.utils";

dayjs.locale("ar");

function BannersTemplate() {
  const { banners, isLoading, isError, error, pagination, page, setPage } = useBanners();
  const { deleteBanner, isPending: isDeleting } = useDeleteBanner();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      <PageHeader
        title="البانرات"
        description="يمكنك إدارة جميع البانرات من هنا."
        actions={[
          {
            label: "إضافة بانر جديد",
            icon: Plus,
            onClick: () => setIsDialogOpen(true),
            variant: "default",
          },
        ]}
      />

      <AddBannerDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingBanner(null);
          }
        }}
        banner={editingBanner}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="تأكيد الحذف"
        description={
          deletingBanner
            ? `هل أنت متأكد من حذف البانر "${deletingBanner.bannername}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : "هل أنت متأكد من حذف هذا البانر؟ لا يمكن التراجع عن هذا الإجراء."
        }
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        itemType="حذف"
        itemName={deletingBanner?.bannername}
        onConfirm={async () => {
          if (deletingBanner) {
            await deleteBanner(deletingBanner._id);
            setDeletingBanner(null);
          }
        }}
        onSuccess={() => {
          setDeletingBanner(null);
        }}
      />

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
        <div className="space-y-6">
          {banners.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={ImageIcon}
                  title="لا توجد بانرات متاحة"
                  description="لم يتم إضافة أي بانرات حتى الآن"
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {banners.map((banner: Banner) => {
                  const largeImageUrl = getImageUrl(banner.image_path_lg);
                  const smallImageUrl = getImageUrl(banner.image_path_small);
                  const expired = dayjs(banner.expiration_date).isBefore(dayjs());
                  return (
                    <Card
                      key={banner._id}
                      className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 text-lg">
                            {banner.bannername}
                          </CardTitle>
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingBanner(banner);
                                setIsDialogOpen(true);
                              }}
                              title="تعديل البانر"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setDeletingBanner(banner);
                                setIsDeleteModalOpen(true);
                              }}
                              title="حذف البانر"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {expired && (
                              <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                                منتهي
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {largeImageUrl && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={largeImageUrl}
                              alt={banner.bannername}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}

                        {/* Small Image - only show if available */}
                        {smallImageUrl && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={smallImageUrl}
                              alt={`${banner.bannername} - صغير`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}

                        {/* Banner Info */}
                        <div className="space-y-3 border-t border-border pt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">
                              تاريخ الانتهاء:
                            </span>
                            <span
                              className={
                                expired
                                  ? "font-semibold text-destructive"
                                  : "text-foreground"
                              }
                            >
                              {dayjs(banner.expiration_date).format("DD MMMM YYYY")}
                            </span>
                          </div>
                          {expired && (
                            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
                              <AlertCircleIcon className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                هذا البانر منتهي الصلاحية
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && (
                <BannerPagination
                  pagination={pagination}
                  page={page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default BannersTemplate;
