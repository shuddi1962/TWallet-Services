import { CreditCard, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Cards</h1>
          <p className="mt-1 text-sm text-surface-500">
            Manage your virtual and physical cards
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Order New Card
        </Button>
      </div>

      <EmptyState
        icon={CreditCard}
        title="No cards yet"
        description="Order a virtual or physical card to start spending your crypto."
        action={
          <Button>Order Your First Card</Button>
        }
      />
    </div>
  );
}
