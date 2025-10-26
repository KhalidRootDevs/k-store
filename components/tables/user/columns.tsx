"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "moderator" | "support";
  status: "active" | "inactive" | "suspended" | "pending";
  orders: Array<{
    orderId: string;
    orderNumber: string;
    date: string;
    total: number;
    status: string;
    items: number;
    paymentStatus: string;
  }>;
  notes: Array<{
    content: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }>;
  lastLogin?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserColumnsProps {
  onStatusUpdate: (
    userId: string,
    currentStatus: string,
    userName: string
  ) => void;
  onDeleteUser?: (userId: string, userName: string) => void;
}

export const createUserColumns = ({
  onStatusUpdate,
  onDeleteUser,
}: CreateUserColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const formattedDate = new Date(user.createdAt).toLocaleDateString();

      return (
        <div className="flex items-center gap-3">
          {user.avatar && (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <img src={user.avatar} alt={user.name} className="object-cover" />
            </div>
          )}
          <div className="flex flex-col">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              Joined {formattedDate}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span>{user.email}</span>
          <div className="flex items-center gap-1 mt-1">
            {user.emailVerified && (
              <Badge variant="outline" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span>{user.phone || "N/A"}</span>
          {user.phone && user.phoneVerified && (
            <Badge variant="outline" className="text-xs mt-1">
              Verified
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const user = row.original;
      const getRoleVariant = (role: string) => {
        switch (role) {
          case "admin":
            return "destructive";
          case "moderator":
            return "default";
          case "support":
            return "secondary";
          case "user":
            return "outline";
          default:
            return "outline";
        }
      };

      return (
        <Badge variant={getRoleVariant(user.role)}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => {
      const user = row.original;
      const totalOrders = user.orders?.length || 0;
      const completedOrders =
        user.orders?.filter((order) => order.status === "delivered").length ||
        0;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{totalOrders}</span>
          <span className="text-xs text-muted-foreground">
            {completedOrders} completed
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => {
      const user = row.original;
      const totalSpent =
        user.orders?.reduce((sum, order) => sum + order.total, 0) || 0;

      return <div className="font-medium">${totalSpent.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;

      const getStatusVariant = (status: string) => {
        switch (status) {
          case "active":
            return "default";
          case "inactive":
            return "secondary";
          case "suspended":
            return "destructive";
          case "pending":
            return "outline";
          default:
            return "secondary";
        }
      };

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusUpdate(user._id, user.status, user.name)}
          className={`h-6 px-2 text-xs capitalize ${
            user.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
              : user.status === "inactive"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900"
              : user.status === "suspended"
              ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          {user.status}
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/users/${user._id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${user._id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${user._id}/edit`}>Edit user</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusUpdate(user._id, user.status, user.name)}
              >
                {user.status === "active" ? "Deactivate" : "Activate"} user
              </DropdownMenuItem>
              {onDeleteUser && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDeleteUser(user._id, user.name)}
                >
                  Delete user
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
