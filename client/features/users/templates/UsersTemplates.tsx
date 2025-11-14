"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import type { User, UserRole, Branch } from "../services/userService";
import { getErrorMessage } from "@/utils/api.utils";
import { ColumnDef } from "@tanstack/react-table";
import UniTable, { type Action } from "@/components/shared/UniTable";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AlertCircle, UserIcon, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AddUserDialog } from "../components/AddUserDialog";
import { Badge } from "@/components/ui/badge";
import { UsersFilter } from "../components/UsersFilter";
import type { UseUsersFilters } from "../hooks/useUsers";
import { getImageUrl } from "@/utils/image.utils";
import Image from "next/image";

dayjs.locale("ar");

// Translate role to Arabic
const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: "مدير",
    sales: "مندوب مبيعات",
  };
  return roleMap[role] || role;
};

// Translate branch to Arabic
const getBranchLabel = (branch: Branch): string => {
  const branchMap: Record<Branch, string> = {
    riyadh: "الرياض",
    jeddah: "جدة",
    dammam: "الدمام",
  };
  return branchMap[branch] || branch;
};

function UsersTemplates() {
  const [filters, setFilters] = useState<UseUsersFilters>({});
  const { users, isLoading, isError, error, pagination, page, setPage } = useUsers(1, 10, filters);
  const { deleteUser } = useDeleteUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle filter changes
  const handleFilterChange = (newFilters: UseUsersFilters) => {
    setFilters(newFilters);
    // Page will be reset automatically in useUsers hook
  };

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "image",
      header: "الصورة",
      cell: ({ row }) => {
        const user = row.original;
        const imageUrl = user.image ? getImageUrl(user.image) : null;
        return (
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "الاسم",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.getValue("email")}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "الدور",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        const roleVariants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
          admin: "destructive",
          sales: "secondary",
        };
        const variant = roleVariants[role] || "default";
        return (
          <Badge variant={variant}>
            {getRoleLabel(role)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "التقييم",
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number | undefined;
        if (rating === undefined) return <div className="text-muted-foreground">-</div>;
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-yellow-500">★</span>
          </div>
        );
      },
    },
    {
      accessorKey: "whatsNumber",
      header: "رقم الواتساب",
      cell: ({ row }) => {
        const whatsNumber = row.getValue("whatsNumber") as string | undefined;
        return <div className="text-muted-foreground">{whatsNumber || "-"}</div>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "رقم الهاتف",
      cell: ({ row }) => {
        const phoneNumber = row.getValue("phoneNumber") as string | undefined;
        return <div className="text-muted-foreground">{phoneNumber || "-"}</div>;
      },
    },
    {
      accessorKey: "branch",
      header: "الفرع",
      cell: ({ row }) => {
        const branch = row.getValue("branch") as Branch | undefined;
        if (!branch) return <div className="text-muted-foreground">-</div>;
        const branchVarient = branch === "riyadh" ? "default" : branch === "jeddah" ? "secondary" : "destructive";
        return (
          <Badge variant={branchVarient}>
            {getBranchLabel(branch)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الإنشاء",
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
  const actions: Action<User>[] = [
    {
      label: "Edit",
      onClick: (user) => {
        setEditingUser(user);
        setIsDialogOpen(true);
      },
    },
    {
      label: "Delete",
      onClick: (user) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <section className="space-y-6">
      <PageHeader
        title="المستخدمين"
        description="يمكنك إدارة جميع المستخدمين من هنا."
        actions={[
          {
            label: "إضافة مستخدم جديد",
            icon: Plus,
            onClick: () => setIsDialogOpen(true),
            variant: "default",
          },
        ]}
      />

      <AddUserDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
        user={editingUser}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="تأكيد الحذف"
        description={
          deletingUser
            ? `هل أنت متأكد من حذف المستخدم "${deletingUser.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
            : "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
        }
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
        itemType="حذف"
        itemName={deletingUser?.name}
        onConfirm={async () => {
          if (deletingUser) {
            await deleteUser(deletingUser._id);
            setDeletingUser(null);
          }
        }}
        onSuccess={() => {
          setDeletingUser(null);
        }}
      />

     <Card className="p-6">
     <UsersFilter
        onFilterChange={handleFilterChange}
        initialSearch={filters.search}
        initialRole={filters.role}
        initialBranch={filters.branch}
        initialRating={filters.rating}
      />
     </Card>

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
          {users.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={UserIcon}
                  title="لا يوجد مستخدمين متاحين"
                  description="لم يتم إضافة أي مستخدمين حتى الآن"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
              columns={columns}
              data={users}
              actions={actions}
              totalItems={pagination?.total || 0}
              itemsPerPage={pagination?.limit || 10}
              currentPage={page}
              onPageChange={setPage}
              tableName="مستخدم"
              isLoading={isLoading}
            />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default UsersTemplates;
