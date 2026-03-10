'use client';

import { ConfirmDeleteDialog } from '@/components/modals/confirm-delete-modal';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface InvoiceActionProps {
  invoice: any;
}

export default function InvoiceAction({ invoice }: InvoiceActionProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    console.log(invoice?.id);
    toast.success('Invoice deleted successfully');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Invoice */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/create-invoice?view=${invoice.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Invoice</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View</p>
        </TooltipContent>
      </Tooltip>

      {/* Edit Invoice */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/create-invoice?edit=${invoice.id}`}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Invoice</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      {/* Delete Invoice */}
      <Button variant="outline" size="icon" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description={`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`}
      />
    </div>
  );
}
