import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

const NICHO_AGENT_ID = "ee8f8806-b7b6-4ad7-b1ee-8788a84b55d2";
const TIMEOUT_MS = 60000; // 1 minuto
const POLL_INTERVAL_MS = 2000; // 2 segundos

export default function OnboardingLoading() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [dots, setDots] = useState(0);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [authLoading, user, navigate]);

  // Animação dos dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Polling para verificar se a conversa foi criada
  useEffect(() => {
    if (!user) return;

    const startTime = Date.now();

    const checkConversation = async () => {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", user.id)
          .eq("agent_id", NICHO_AGENT_ID)
          .limit(1);

        if (error) {
          logger.error("Erro ao verificar conversa:", error);
        }

        // Redireciona se encontrou conversa ou timeout
        if (data?.length || Date.now() - startTime > TIMEOUT_MS) {
          if (data?.length) {
            logger.info("Conversa do Nicho encontrada, redirecionando...");
          } else {
            logger.info("Timeout atingido, redirecionando ao dashboard...");
          }
          navigate("/dashboard");
        }
      } catch (err) {
        logger.error("Erro no polling:", err);
      }
    };

    // Verifica imediatamente
    checkConversation();

    // Continua verificando a cada 2 segundos
    const interval = setInterval(checkConversation, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Animação do Personal */}
      <div className="relative mb-8">
        <Dumbbell 
          className="w-20 h-20 text-primary animate-lift-weight" 
          strokeWidth={1.5}
        />
      </div>

      {/* Texto principal */}
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">
          Fala, Personal!
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Me dá uns segundos — estou analisando suas informações para sugerir o nicho ideal pra você.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Assim que eu terminar, você pode abrir o agente de{" "}
          <span className="text-primary font-medium">Nicho & Posicionamento</span>{" "}
          para dar uma olhada no que criei para você.
        </p>
      </div>

      {/* Dots animados */}
      <div className="flex gap-2 mt-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i <= dots ? "bg-primary scale-110" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
