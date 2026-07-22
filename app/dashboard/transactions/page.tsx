import { ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <p className="mt-1 text-sm text-surface-400">
          View your payment and transaction history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Your crypto payments and card transactions will appear here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
