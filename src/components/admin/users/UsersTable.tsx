import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MessageSquare, MoreHorizontal, Pencil, ShieldCheck, CheckCircle, AlertCircle, Ban, UserCheck, Trash2 } from "lucide-react";
import { AdminUser, useUpdateUserOnboarding, useConfirmUserEmail, useBanUser, useDeleteUser } from "@/hooks/useAdminUsers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserDeleteDialog } from "./UserDeleteDialog";

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onViewDocuments: (userId: string) => void;
  onEditUser: (user: AdminUser) => void;
}

export function UsersTable({ users, isLoading, onViewDocuments, onEditUser }: UsersTableProps) {
  const { user: currentUser } = useAuth();
  const updateOnboarding = useUpdateUserOnboarding();
  const confirmEmail = useConfirmUserEmail();
  const banUser = useBanUser();
  const deleteUser = useDeleteUser();

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const isBanned = (user: AdminUser) => {
    if (!user.banned_until) return false;
    return new Date(user.banned_until) > new Date();
  };

  const handleOnboardingToggle = async (userId: string, currentValue: boolean) => {
    try {
      await updateOnboarding.mutateAsync({ userId, onboardingCompleted: !currentValue });
      toast.success("Status atualizado com sucesso");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleConfirmEmail = async (userId: string, email: string) => {
    try {
      await confirmEmail.mutateAsync(userId);
      toast.success(`Email ${email} confirmado com sucesso`);
    } catch {
      toast.error("Erro ao confirmar email");
    }
  };

  const handleBanToggle = async (user: AdminUser) => {
    const ban = !isBanned(user);
    try {
      await banUser.mutateAsync({ userId: user.id, ban });
      toast.success(ban ? "Usuário desativado" : "Usuário reativado");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro";
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget.id);
      toast.success("Usuário excluído com sucesso");
      setDeleteTarget(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao excluir";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-foreground font-semibold">Nome</TableHead>
              <TableHead className="text-foreground font-semibold">Email</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Role</TableHead>
              <TableHead className="text-foreground font-semibold">Criado em</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Mensagens</TableHead>
              <TableHead className="text-foreground font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const banned = isBanned(user);
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {user.nome || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-center">
                      {banned ? (
                        <Badge variant="destructive">Inativo</Badge>
                      ) : (
                        <Badge className="bg-green-600 text-white hover:bg-green-600">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.is_admin ? (
                        <Badge className="bg-primary text-primary-foreground">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Usuário</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{user.total_messages}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="ml-1">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50 bg-popover">
                          <DropdownMenuItem onClick={() => onEditUser(user)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewDocuments(user.id)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Documentos
                          </DropdownMenuItem>
                          {!isCurrentUser && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBanToggle(user)}
                                disabled={banUser.isPending}
                              >
                                {banned ? (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Reativar
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Desativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteTarget(user)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <UserDeleteDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isPending={deleteUser.isPending}
      />
    </>
  );
}
