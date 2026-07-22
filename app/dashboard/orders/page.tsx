import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="mt-1 text-sm text-surface-400">
          View and track your card orders
        </p>
      </div>

      <EmptyState
        icon={ShoppingCart}
        title="No orders yet"
        description="When you place a card order, it will appear here with real-time status tracking."
        action={
          <Button>Order a Card</Button>
        }
      />
    </div>
  );
}
