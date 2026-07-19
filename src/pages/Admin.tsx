import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard";
import { AdminUsers } from "@/components/admin/users/AdminUsers";
import { AdminAgents } from "@/components/admin/agents/AdminAgents";

type AdminTab = "dashboard" | "users" | "agents";

export default function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabParam = searchParams.get("tab");
  const validTabs: AdminTab[] = ["dashboard", "users", "agents"];
  const initialTab = validTabs.includes(tabParam as AdminTab) 
    ? (tabParam as AdminTab) 
    : "dashboard";
  
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "agents":
        return <AdminAgents />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onBack={handleBack}
    >
      {renderContent()}
    </AdminLayout>
  );
}
