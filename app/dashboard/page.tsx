import Link from "next/link";
import {
  CreditCard,
  ShoppingCart,
  Wallet,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const stats = [
  {
    label: "Active Cards",
    value: "0",
    icon: CreditCard,
    trend: { value: "New", positive: true },
  },
  {
    label: "Total Orders",
    value: "0",
    icon: ShoppingCart,
  },
  {
    label: "Wallet Balance",
    value: "—",
    icon: Wallet,
  },
  {
    label: "Total Spent",
    value: "$0",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="mt-1 text-sm text-surface-400">
            Welcome back to your dashboard
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/orders">
            <Plus className="h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/orders">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={ShoppingCart}
              title="No orders yet"
              description="Place your first card order to get started with TWallet."
              action={
                <Button size="sm" asChild>
                  <Link href="/dashboard/orders">Order a Card</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Wallet Status</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/wallet">
                  Manage
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Wallet}
              title="No wallet connected"
              description="Connect your crypto wallet to start making payments."
              action={
                <Button size="sm" asChild>
                  <Link href="/dashboard/wallet">Connect Wallet</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center text-surface-500">
                  No transactions yet
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
