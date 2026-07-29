import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardRealtime } from "@/components/dashboard/dashboard-realtime";
import { BottomTabBar } from "@/components/dashboard/bottom-tab-bar";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#05080f]">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="relative flex-1 overflow-x-hidden p-4 pb-24 lg:p-6 lg:pb-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_50%)]" />
          <div className="relative mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <BottomTabBar />
      <DashboardRealtime />
    </div>
  );
}
