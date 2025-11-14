"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { PageHeader } from "@/components/shared/PageHeader";
import UniLoading from "@/components/shared/UniLoading";
import NoDataMsg from "@/components/shared/NoDataMsg";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import type { User, UserRole } from "../services/userService";
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

const getRoleLabel = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: "Admin",
  };
  return roleMap[role] || role;
};

function UsersTemplates() {
  const { users, isLoading, isError, error } = useUsers();
  const { deleteUser } = useDeleteUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{row.getValue("email")}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        const roleVariants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
          admin: "destructive",
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
        title="Users"
        description="You can manage all users here."
        actions={[
          {
            label: "Add new user",
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
        title="Confirm deletion"
        description={
          deletingUser
            ? `Are you sure you want to delete   "${deletingUser.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this user? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        itemType="Delete"
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
          {users.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <NoDataMsg
                  icon={UserIcon}
                  title="No users available"
                  description="No users have been added yet"
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6">
              <UniTable
              columns={columns}
              data={users}
              actions={actions}
              tableName="User"
              isLoading={isLoading}
              totalItems={users.length}
              itemsPerPage={users.length || 10}
            />
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

export default UsersTemplates;
