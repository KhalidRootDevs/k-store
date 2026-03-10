"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean, name: string) => void;
}

function ProductActions({
  product,
  onDelete,
  onToggleStatus,
}: ProductActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Link href={`/admin/products/edit/${product._id}`}>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(product._id, product.name)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}

const getStockStatus = (stock: number, active: boolean) => {
  if (!active) return { text: "Inactive", variant: "secondary" as const };
  if (stock === 0)
    return { text: "Out of Stock", variant: "destructive" as const };
  if (stock < 10) return { text: "Low Stock", variant: "destructive" as const };
  return { text: "In Stock", variant: "default" as const };
};

export const createProductColumns = (
  onDelete: (id: string, name: string) => void,
  onToggleStatus: (id: string, currentStatus: boolean, name: string) => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-10 w-10 rounded-md overflow-hidden">
        <Image
          src={row.original.images[0] || "/placeholder.svg"}
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
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.featured && (
          <Badge variant="secondary" className="mt-1 text-xs">
            Featured
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.original.sku}
      </Badge>
    ),
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <span>{row.original.categoryId?.name || "Uncategorized"}</span>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">${row.original.price.toFixed(2)}</span>
        {row.original.compareAtPrice &&
          row.original.compareAtPrice > row.original.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${row.original.compareAtPrice.toFixed(2)}
            </span>
          )}
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => <span>{row.original.stock}</span>,
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const stockStatus = getStockStatus(
        row.original.stock,
        row.original.active,
      );
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onToggleStatus(
              row.original._id,
              row.original.active,
              row.original.name,
            )
          }
          className={`h-6 px-2 text-xs ${
            stockStatus.variant === "destructive"
              ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
              : stockStatus.variant === "secondary"
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
          }`}
        >
          {stockStatus.text}
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <ProductActions
        product={row.original}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    ),
  },
];
