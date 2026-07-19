import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown, { Components } from "react-markdown";
import { Pin, FileText } from "lucide-react";

interface DocumentPanelProps {
  content: string;
  onSave: (content: string) => void;
  hasOfficialDocument: boolean;
  onSetOfficial?: () => void;
  canSetOfficial?: boolean;
}

// Pré-processa o conteúdo para converter bullets Unicode e preservar quebras de linha
const preprocessContent = (content: string) => {
  return content
    .replace(/^• /gm, '- ')           // Converter bullets Unicode para sintaxe Markdown
    .replace(/(?<!\n)\n(?!\n)/g, '  \n');  // Adicionar 2 espaços antes de \n simples (hard break)
};

// Componentes customizados com classes Tailwind para cada elemento Markdown
const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-semibold mt-4 mb-2 text-foreground">{children}</h4>,
  p: ({ children }) => <p className="my-3 text-foreground leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>,
  li: ({ children }) => <li className="text-foreground">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-border" />,
  a: ({ href, children }) => (
    <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export function DocumentPanel({ 
  content, 
  onSave, 
  hasOfficialDocument, 
  onSetOfficial,
  canSetOfficial = false 
}: DocumentPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    onSave(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do documento */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Documento Oficial</h3>
          {hasOfficialDocument && (
            <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              <Pin className="w-3 h-3" />
              Oficial
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {canSetOfficial && onSetOfficial && (
            <Button
              onClick={onSetOfficial}
              size="sm"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <Pin className="w-3 h-3 mr-1" />
              Tornar Oficial
            </Button>
          )}
          {hasOfficialDocument && (
            isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Salvar
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className="border-primary text-primary"
              >
                Editar
              </Button>
            )
          )}
        </div>
      </div>

      {/* Conteúdo do documento */}
      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[500px] font-mono text-sm"
            placeholder="Digite o conteúdo do documento em Markdown..."
          />
        ) : hasOfficialDocument && content ? (
          <div className="max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {preprocessContent(content)}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground mb-2">Nenhum documento oficial definido</p>
            <p className="text-sm text-muted-foreground">
              Selecione uma conversa no histórico e clique em "Tornar Oficial" para definir o documento oficial deste agente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
