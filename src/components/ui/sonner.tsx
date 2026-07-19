import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          // Toast de erro - vermelho
          error: "group toast bg-red-600 text-white border-red-700 shadow-lg",
          // Toast de sucesso - laranja (primary)
          success: "group toast bg-primary text-primary-foreground border-primary shadow-lg",
          // Toast de info - laranja (primary)
          info: "group toast bg-primary text-primary-foreground border-primary shadow-lg",
          // Toast padrão - laranja
          toast: "group toast bg-primary text-primary-foreground border-primary shadow-lg",
          description: "text-white/90",
          actionButton: "bg-white text-primary font-semibold",
          cancelButton: "bg-white/20 text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
