import { useState, useRef, useEffect } from "react";
import { logger } from "@/lib/logger";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Download, Loader2, FileText, FileCheck } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  officialDocument: string;
  currentDocument: string;
  agentTitle: string;
}

// Componentes Markdown otimizados para PDF (cores escuras para impressão)
const pdfMarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-6 mb-4 text-black">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-6 mb-3 text-black">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-5 mb-2 text-black">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold mt-4 mb-2 text-black">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="my-3 text-black leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="text-black">{children}</li>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-400 pl-4 my-4 italic text-gray-700">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  hr: () => <hr className="my-6 border-gray-300" />,
};

// Pré-processamento de markdown (converte \n em hard breaks)
function preprocessMarkdown(content: string): string {
  if (!content) return "";
  // Converte bullets Unicode para markdown
  let processed = content.replace(/•/g, "-");
  // Adiciona hard breaks
  processed = processed.replace(/\n/g, "  \n");
  return processed;
}

export function ExportDialog({
  open,
  onOpenChange,
  officialDocument,
  currentDocument,
  agentTitle,
}: ExportDialogProps) {
  const [exportType, setExportType] = useState<"official" | "current">("official");
  const [isExporting, setIsExporting] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const hasOfficialDocument = !!officialDocument?.trim();
  const hasCurrentDocument = !!currentDocument?.trim();

  // Selecionar automaticamente a opção disponível
  useEffect(() => {
    if (open) {
      if (hasOfficialDocument) {
        setExportType("official");
      } else if (hasCurrentDocument) {
        setExportType("current");
      }
      // Pequeno delay para garantir que o conteúdo renderizou
      const timer = setTimeout(() => setIsContentReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsContentReady(false);
    }
  }, [open, hasOfficialDocument, hasCurrentDocument]);

  const selectedContent = exportType === "official" ? officialDocument : currentDocument;

  const handleExport = async () => {
    if (!selectedContent?.trim()) {
      toast({
        title: "Documento vazio",
        description: "Não há conteúdo para exportar.",
        variant: "destructive",
      });
      return;
    }

    const element = contentRef.current;
    if (!element) {
      toast({
        title: "Erro ao renderizar",
        description: "Não foi possível preparar o documento.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Capturar como canvas com alta qualidade
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Criar PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calcular proporção para caber na largura do PDF (com margens)
      const marginX = 10;
      const marginY = 10;
      const contentWidth = pdfWidth - marginX * 2;
      const ratio = contentWidth / imgWidth;
      const scaledImgHeight = imgHeight * ratio;

      const pageContentHeight = pdfHeight - marginY * 2;

      if (scaledImgHeight <= pageContentHeight) {
        // Cabe em uma página
        pdf.addImage(imgData, "PNG", marginX, marginY, contentWidth, scaledImgHeight);
      } else {
        // Múltiplas páginas
        let remainingHeight = scaledImgHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          // Altura a capturar nesta página (em pixels originais)
          const sliceHeightInPDF = Math.min(remainingHeight, pageContentHeight);
          const sliceHeightInPixels = sliceHeightInPDF / ratio;

          // Criar canvas para este slice
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeightInPixels;

          const sliceCtx = sliceCanvas.getContext("2d");
          if (sliceCtx) {
            sliceCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvas.width,
              sliceHeightInPixels,
              0,
              0,
              canvas.width,
              sliceHeightInPixels
            );

            const sliceData = sliceCanvas.toDataURL("image/png");
            pdf.addImage(sliceData, "PNG", marginX, marginY, contentWidth, sliceHeightInPDF);
          }

          remainingHeight -= sliceHeightInPDF;
          sourceY += sliceHeightInPixels;

          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }
      }

      // Gerar nome do arquivo
      const sanitizedTitle = agentTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      
      const typeLabel = exportType === "official" ? "oficial" : "conversa";
      const fileName = `${sanitizedTitle}-${typeLabel}.pdf`;

      pdf.save(fileName);

      toast({ title: "PDF exportado com sucesso!" });
      onOpenChange(false);
    } catch (error) {
      logger.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao exportar PDF",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const canExport =
    (exportType === "official" && hasOfficialDocument) ||
    (exportType === "current" && hasCurrentDocument);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Documento
          </DialogTitle>
          <DialogDescription>
            Escolha qual documento deseja exportar como PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-sm font-medium mb-3 block">
            O que você deseja exportar?
          </Label>

          <RadioGroup
            value={exportType}
            onValueChange={(value) => setExportType(value as "official" | "current")}
            className="space-y-3"
          >
            {/* Opção: Documento Oficial */}
            <div
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                hasOfficialDocument
                  ? "cursor-pointer hover:bg-accent"
                  : "opacity-50 cursor-not-allowed"
              } ${exportType === "official" && hasOfficialDocument ? "border-primary bg-accent" : "border-border"}`}
            >
              <RadioGroupItem
                value="official"
                id="official"
                disabled={!hasOfficialDocument}
                className="mt-0.5"
              />
              <Label
                htmlFor="official"
                className={`flex-1 ${hasOfficialDocument ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Documento Oficial
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasOfficialDocument
                    ? "O documento fixado como oficial do agente"
                    : "Nenhum documento oficial definido"}
                </p>
              </Label>
            </div>

            {/* Opção: Documento da Conversa */}
            <div
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                hasCurrentDocument
                  ? "cursor-pointer hover:bg-accent"
                  : "opacity-50 cursor-not-allowed"
              } ${exportType === "current" && hasCurrentDocument ? "border-primary bg-accent" : "border-border"}`}
            >
              <RadioGroupItem
                value="current"
                id="current"
                disabled={!hasCurrentDocument}
                className="mt-0.5"
              />
              <Label
                htmlFor="current"
                className={`flex-1 ${hasCurrentDocument ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Documento da Conversa Atual
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasCurrentDocument
                    ? "O conteúdo gerado nesta conversa"
                    : "Converse com o agente primeiro"}
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={!canExport || isExporting || !isContentReady}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Container hidden para renderização do conteúdo */}
      {open && (
        <div
          ref={contentRef}
          className="fixed left-[-9999px] top-0 w-[800px] bg-white p-10"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <h1 className="text-3xl font-bold mb-6 text-black border-b pb-4 border-gray-300">
            {agentTitle}
          </h1>
          <ReactMarkdown components={pdfMarkdownComponents}>
            {preprocessMarkdown(selectedContent || "")}
          </ReactMarkdown>
        </div>
      )}
    </Dialog>
  );
}
