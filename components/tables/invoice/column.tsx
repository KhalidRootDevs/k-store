"use client";

import { Button } from "@/components/ui/button";

import type { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { DataTableColumnHeader } from "../data-table-column-header";
import InvoiceAction from "./action";

function InvoiceNumberCell({ invoiceNumber }: { invoiceNumber: string }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied invoice number!");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[150px] truncate">{invoiceNumber}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copyToClipboard(invoiceNumber)}
        title="Copy Invoice Number"
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy Invoice Number</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice #" />
    ),
    cell: ({ row }) => (
      <InvoiceNumberCell invoiceNumber={row.original.invoiceNumber} />
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.clientName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.clientEmail}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <span>
          {invoice.currency} {invoice.amount.toFixed(2)}
        </span>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => (
      <span>{new Date(row.original.dueDate).toLocaleDateString()}</span>
    ),
  },

  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <InvoiceAction invoice={row.original} />,
  },
];
