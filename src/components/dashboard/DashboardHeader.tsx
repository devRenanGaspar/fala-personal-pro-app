import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserName } from "@/hooks/useUserName";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { ProfileDialog } from "./ProfileDialog";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: userName, isLoading } = useUserName();
  const { data: roleData } = useUserRole();
  const [profileOpen, setProfileOpen] = useState(false);

  const displayName = userName?.nomeProfissional || userName?.nome || "Usuário";
  const isAdmin = roleData?.isAdmin ?? false;

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Fala Personal" 
          className="h-10 w-auto"
        />

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-9 w-32" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground hover:bg-muted"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">{displayName}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-card border-border"
              >
                <DropdownMenuItem
                  onClick={() => setProfileOpen(true)}
                  className="cursor-pointer text-foreground hover:bg-muted"
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="cursor-pointer text-foreground hover:bg-muted"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Administração
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      </div>
    </div>
  );
}
