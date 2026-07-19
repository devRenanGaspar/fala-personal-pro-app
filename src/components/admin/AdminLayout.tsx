import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

type AdminTab = "dashboard" | "users" | "agents";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onBack: () => void;
}

export function AdminLayout({ children, activeTab, onTabChange, onBack }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onBack={onBack}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
