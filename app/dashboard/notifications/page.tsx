import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
        <p className="mt-1 text-sm text-surface-500">
          Stay updated on your orders and account activity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You'll be notified about order updates, payment confirmations, and account activity here."
          />
        </CardContent>
      </Card>
    </div>
  );
}
