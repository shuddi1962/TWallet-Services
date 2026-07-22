import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20">
            <Icon className="h-5 w-5 text-brand-400" />
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-success" : "text-error",
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="mt-1 text-sm text-surface-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
