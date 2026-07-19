import { useState } from "react";
import { useAdminUsers, type AdminUser } from "@/hooks/useAdminUsers";
import { UsersTable } from "./UsersTable";
import { UsersPagination } from "./UsersPagination";
import { UserDocumentsDialog } from "./UserDocumentsDialog";
import { UserEditDialog } from "./UserEditDialog";
import { UserCreateDialog } from "./UserCreateDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

export function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useAdminUsers(page, 50, search);

  const handleViewDocuments = (userId: string) => {
    setSelectedUserId(userId);
    setDocumentsOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Usuários</h2>
          <p className="text-muted-foreground">
            {data?.pagination.total
              ? `${data.pagination.total} usuários encontrados`
              : "Gerenciar usuários do sistema"}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email ou nome..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <UsersTable
        users={data?.users || []}
        isLoading={isLoading}
        onViewDocuments={handleViewDocuments}
        onEditUser={handleEditUser}
      />

      {data?.pagination && data.pagination.total_pages > 1 && (
        <div className="flex justify-center">
          <UsersPagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}

      <UserDocumentsDialog
        userId={selectedUserId}
        open={documentsOpen}
        onOpenChange={setDocumentsOpen}
      />

      <UserEditDialog
        user={editUser}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <UserCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
}
