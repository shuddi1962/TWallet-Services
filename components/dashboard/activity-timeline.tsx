"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShoppingBag, Wallet, CreditCard, Bell } from "lucide-react";

const ACTIVITY_ICONS: Record<string, typeof Clock> = {
  order: ShoppingBag,
  wallet: Wallet,
  card: CreditCard,
  notification: Bell,
};

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-8 w-8 text-surface-400 mb-2" aria-hidden="true" />
            <p className="text-sm text-surface-400">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {activities.map((activity, index) => {
            const Icon = ACTIVITY_ICONS[activity.type] ?? Clock;
            return (
              <div key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < activities.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-px bg-white/10" aria-hidden="true" />
                )}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
                  <Icon className="h-4 w-4 text-brand-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-surface-400">{activity.description}</p>
                  <p className="mt-1 text-xs text-surface-500">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
