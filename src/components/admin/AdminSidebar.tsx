import { LayoutDashboard, Users, Bot, MessageSquareText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type AdminTab = "dashboard" | "users" | "agents" | "prompts";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onBack: () => void;
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "users" as const, label: "Usuários", icon: Users },
  { id: "agents" as const, label: "Agentes", icon: Bot },
  { id: "prompts" as const, label: "Prompts", icon: MessageSquareText },
];

export function AdminSidebar({ activeTab, onTabChange, onBack }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <img 
          src={logo} 
          alt="Fala Personal" 
          className="h-8 w-auto mb-2"
        />
        <p className="text-sm text-muted-foreground">Administração</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao App
        </Button>
      </div>
    </aside>
  );
}
