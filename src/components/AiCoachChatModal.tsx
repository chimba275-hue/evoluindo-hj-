import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
  HelpCircle,
  Loader2,
  RefreshCw,
  Scale,
  Flame,
} from "lucide-react";
import { ChatMessage, FastingSession, UserProfile } from "../types";
import { getFastingPhase } from "../utils/calculations";

interface AiCoachChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  fastingSession: FastingSession;
  caloriesToday: number;
  waterToday: number;
  streak: number;
}

export const AiCoachChatModal: React.FC<AiCoachChatModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  fastingSession,
  caloriesToday,
  waterToday,
  streak,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "model",
      content: `Olá! Sou o seu Coach Express de Emagrecimento e Jejum Intermitente. 
Estou conectado em tempo real com seu peso (${userProfile.currentWeight}kg), meta (${userProfile.goalWeight}kg) e seu jejum de hoje.
Qual a sua maior dúvida ou obstáculo na rotina hoje?`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const elapsedHours = fastingSession.isActive && fastingSession.startTime
    ? (Date.now() - new Date(fastingSession.startTime).getTime()) / 3600000
    : 0;
  const currentPhase = getFastingPhase(elapsedHours);

  const quickQuestions = [
    "Estou travado no mesmo peso há mais de uma semana, o que fazer?",
    "Fome na 14ª hora de jejum: quebro ou espero? O que tomar?",
    "Opções de refeição de 10 minutos para quem não tem tempo de cozinhar",
    "Como manter o jejum no fim de semana sem me isolar socialmente?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/coach-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            currentWeight: userProfile.currentWeight,
            initialWeight: userProfile.initialWeight,
            goalWeight: userProfile.goalWeight,
            currentFastingHours: Number(elapsedHours.toFixed(1)),
            fastingProtocol: fastingSession.protocol,
            fastingPhase: currentPhase.name,
            isFasting: fastingSession.isActive,
            caloriesToday,
            calorieGoal: userProfile.dailyCalorieTarget,
            waterToday,
            waterGoal: userProfile.dailyWaterTargetMl,
            streakDays: streak,
            activityLevel: userProfile.activityLevel,
          },
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao consultar o coach.");
      }

      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: json.reply,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: "Tive um pequeno problema ao conectar com o serviço de IA. Verifique sua conexão e tente novamente.",
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[620px] max-h-[92vh] shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">Coach Express (IA)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Online
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Nutrição, fisiologia do jejum e ajustes anti-platô personalizados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Context Bar */}
        <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600 overflow-x-auto gap-4">
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <Scale className="w-3.5 h-3.5 text-stone-500" />
            <span>Peso: {userProfile.currentWeight}kg → {userProfile.goalWeight}kg</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>{fastingSession.isActive ? `Jejum: ${elapsedHours.toFixed(1)}h (${currentPhase.name.split(" ")[0]})` : "Janela Aberta"}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-medium">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Streak: {streak}d</span>
          </div>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isCoach = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isCoach ? "items-start" : "items-end justify-end"}`}
              >
                {isCoach && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isCoach
                      ? "bg-stone-100 text-stone-800 rounded-tl-xs"
                      : "bg-emerald-600 text-white rounded-br-xs font-medium"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isCoach ? "text-stone-400" : "text-emerald-200"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs pl-9">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>O Coach está analisando seus dados e digitando...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="shrink-0 text-[11px] font-medium px-2.5 py-1.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-lg transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-stone-200 flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            placeholder="Pergunte sobre seu jejum, fome, treino ou ajuste de dieta..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 text-white rounded-xl transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
