import ReactMarkdown, { Components } from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

// Pré-processa o conteúdo para converter bullets Unicode e preservar quebras de linha
const preprocessContent = (content: string) => {
  return content
    .replace(/^• /gm, '- ')
    .replace(/(?<!\n)\n(?!\n)/g, '  \n');
};

// Componentes Markdown adaptados para o chat (menores que o DocumentPanel)
const chatMarkdownComponents: Components = {
  h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-2 my-2 italic opacity-80">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-border" />,
  a: ({ href, children }) => (
    <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export function ChatMessage({ role, content, createdAt }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="text-sm">
            <ReactMarkdown components={chatMarkdownComponents}>
              {preprocessContent(content)}
            </ReactMarkdown>
          </div>
        )}
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
