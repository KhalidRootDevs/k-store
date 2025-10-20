"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "../data-table-column-header";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  active: boolean;
  slug: string;
  parentId?: { _id: string; name: string } | null;
  products?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryActionsProps {
  category: Category;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean, name: string) => void;
}

function CategoryActions({
  category,
  onDelete,
  onToggleStatus,
}: CategoryActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/categories/edit/${category._id}`}>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(category._id)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

export const createCategoryColumns = (
  onDelete: (id: string) => void,
  onToggleStatus: (id: string, currentStatus: boolean, name: string) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-10 w-10 rounded-md overflow-hidden">
        <Image
          src={row.original.image || "/placeholder.svg"}
          alt={row.original.name}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.parentId && (
          <span className="text-muted-foreground mr-2">└─</span>
        )}
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "parentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent Category" />
    ),
    cell: ({ row }) =>
      row.original.parentId ? (
        <Badge variant="outline">{row.original.parentId.name}</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Top Level</span>
      ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.original.description || "No description"}
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.slug}
      </Badge>
    ),
  },
  {
    accessorKey: "featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Featured" />
    ),
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge variant="secondary">Featured</Badge>
      ) : (
        <Badge variant="outline">Regular</Badge>
      ),
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          onToggleStatus(
            row.original._id,
            row.original.active,
            row.original.name
          )
        }
        className={`h-6 px-2 text-xs ${
          row.original.active
            ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
            : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
        }`}
      >
        {row.original.active ? "Active" : "Inactive"}
      </Button>
    ),
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <CategoryActions
        category={row.original}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    ),
  },
];
