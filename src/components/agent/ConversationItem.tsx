import { useState, useRef, useEffect } from "react";
import { Pin, MoreHorizontal, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationItemProps {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  isActive: boolean;
  isOfficial: boolean;
  onClick: () => void;
  onRename: (newTitle: string) => void;
}

export function ConversationItem({
  title,
  content,
  createdAt,
  isActive,
  isOfficial,
  onClick,
  onRename,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar editedTitle quando title muda externamente
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Focar input quando entrar em modo de edição
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedTitle = editedTitle.trim();
    
    // Não salvar se vazio ou igual ao anterior
    if (!trimmedTitle) {
      setEditedTitle(title);
      setIsEditing(false);
      return;
    }
    
    if (trimmedTitle !== title) {
      onRename(trimmedTitle);
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={isEditing ? undefined : onClick}
      className={`w-full text-left p-3 rounded-lg border transition-colors ${
        isActive
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary hover:bg-card/50"
      } ${isEditing ? "" : "cursor-pointer"}`}
    >
      <div className="flex items-center justify-between mb-1 gap-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm py-0 px-2 flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-sm font-semibold text-foreground truncate flex-1">
            {title}
          </span>
        )}

        <div className="flex items-center gap-1 shrink-0">
          {isOfficial && (
            <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              <Pin className="w-3 h-3" />
              Oficial
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </span>
          
          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Renomear
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {content ? content.substring(0, 60) : "Conversa vazia"}...
      </p>
    </div>
  );
}
