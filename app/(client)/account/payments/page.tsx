'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Eye, Download } from 'lucide-react';
import Link from 'next/link';

const payments = [
  {
    id: 'PAY-2024-001',
    orderId: 'ORD-2024-001',
    date: '2024-01-15',
    method: 'Visa •••• 4242',
    amount: 129.99,
    status: 'Completed'
  },
  {
    id: 'PAY-2024-002',
    orderId: 'ORD-2024-002',
    date: '2024-01-10',
    method: 'Mastercard •••• 8888',
    amount: 79.99,
    status: 'Completed'
  },
  {
    id: 'PAY-2024-003',
    orderId: 'ORD-2024-003',
    date: '2024-01-05',
    method: 'PayPal',
    amount: 249.99,
    status: 'Pending'
  },
  {
    id: 'PAY-2023-125',
    orderId: 'ORD-2023-125',
    date: '2023-12-28',
    method: 'Visa •••• 4242',
    amount: 59.99,
    status: 'Completed'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    case 'Refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{payment.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.date}
                      </p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground">Order ID</p>
                      <p className="font-medium">{payment.orderId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{payment.method}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="text-lg font-medium">
                        ${payment.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${payment.orderId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Order
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <CreditCard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No payment history</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
