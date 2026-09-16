import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Flame,
  Zap,
  Sparkles,
  Clock,
  Award,
  ChevronRight,
  Info,
  Calendar,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FastingPhaseInfo, FastingProtocolType, FastingSession, FastingHistoryItem } from "../types";
import { FASTING_PROTOCOLS, FASTING_PHASES } from "../data/initialData";
import { formatTimeHoursMinutes, getFastingPhase } from "../utils/calculations";
import { soundFx } from "../utils/sound";

interface FastingTimerSectionProps {
  session: FastingSession;
  streak: number;
  bestStreak: number;
  onStartFast: (protocol: FastingProtocolType, customStartOffsetHours?: number) => void;
  onEndFast: (actualHours: number, completed: boolean) => void;
  onOpenHistory: () => void;
}

export const FastingTimerSection: React.FC<FastingTimerSectionProps> = ({
  session,
  streak,
  bestStreak,
  onStartFast,
  onEndFast,
  onOpenHistory,
}) => {
  const [selectedProtocol, setSelectedProtocol] = useState<FastingProtocolType>(session.protocol || "16:8");
  const [now, setNow] = useState<number>(Date.now());
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustHoursAgo, setAdjustHoursAgo] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  // Live timer tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const protocolConfig = FASTING_PROTOCOLS.find((p) => p.type === (session.isActive ? session.protocol : selectedProtocol)) || FASTING_PROTOCOLS[0];

  // Elapsed calculations
  const startTimestamp = session.startTime ? new Date(session.startTime).getTime() : now;
  const elapsedSeconds = session.isActive ? Math.max(0, Math.floor((now - startTimestamp) / 1000)) : 0;
  const elapsedHours = elapsedSeconds / 3600;
  const targetSeconds = (session.targetHours || protocolConfig.fastHours) * 3600;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));
  const isGoalReached = elapsedSeconds >= targetSeconds;

  const currentPhase: FastingPhaseInfo = getFastingPhase(elapsedHours);

  // Projected end time
  const targetEndDate = new Date(startTimestamp + targetSeconds * 1000);
  const formattedEndTime = targetEndDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const formattedStartTime = new Date(startTimestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const handleFinishClick = () => {
    setShowEndModal(true);
  };

  const confirmEndFast = () => {
    const completed = elapsedHours >= (session.targetHours || 16);
    if (completed) {
      soundFx.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    onEndFast(Number(elapsedHours.toFixed(1)), completed);
    setShowEndModal(false);
  };

  const handleStartCustomFast = () => {
    onStartFast(selectedProtocol, adjustHoursAgo);
    setShowAdjustModal(false);
    setAdjustHoursAgo(0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Top Banner: Protocol selector & Streak pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Timer de Jejum Intermitente
            </h2>
            <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Ao Vivo
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Queima de gordura e autofagia para quem não tem tempo para rotinas complexas.
          </p>
        </div>

        {/* Streak Gamification Badge */}
        <div
          id="streak-badge"
          className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors"
          onClick={onOpenHistory}
          title="Ver histórico de jejuns"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">Streak Atual</div>
            <div className="text-base font-bold text-stone-900 flex items-center gap-1">
              <span>{streak} {streak === 1 ? "dia batido" : "dias seguidos"}</span>
              <span className="text-xs text-stone-400 font-normal">(Rec: {bestStreak}d)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Selection Tabs (Enabled if not active fast) */}
      {!session.isActive && (
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 block">
            Escolha o protocolo de hoje:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FASTING_PROTOCOLS.map((p) => {
              const isSelected = selectedProtocol === p.type;
              return (
                <button
                  key={p.type}
                  id={`protocol-btn-${p.type}`}
                  onClick={() => setSelectedProtocol(p.type)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                      : "border-stone-200 bg-stone-50/50 hover:bg-stone-100/60 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{p.type}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-white border border-stone-200 text-stone-600">
                      {p.fastHours}h jejum
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1 line-clamp-1">{p.title.split(" ")[1] || p.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Fasting Central Timer Display */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Circular Progress Ring */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-stone-100"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="transition-all duration-1000 ease-out"
              stroke={session.isActive ? (isGoalReached ? "#10b981" : currentPhase.color) : "#e5e7eb"}
              strokeWidth="7"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * (session.isActive ? progressPercent : 0)) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Inside Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {session.isActive ? (isGoalReached ? "Meta Batida! 🎉" : "Tempo em Jejum") : "Protocolo Selecionado"}
            </span>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 my-1 font-mono">
              {session.isActive ? formatTimeHoursMinutes(elapsedSeconds) : `${protocolConfig.fastHours}:00:00`}
            </div>

            <div className="text-xs font-medium text-stone-500">
              {session.isActive ? (
                <>
                  Meta: {session.targetHours}h ({progressPercent}%)
                </>
              ) : (
                <>{protocolConfig.title}</>
              )}
            </div>

            {session.isActive && (
              <div
                className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${currentPhase.badgeBg}`}
              >
                <Zap className="w-3 h-3" />
                <span>{currentPhase.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Info & Actions Card */}
        <div className="w-full md:max-w-md flex flex-col justify-between">
          {session.isActive ? (
            <div className="space-y-4">
              {/* Window times */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="text-xs text-stone-400 font-medium">Início do Jejum</div>
                  <div className="text-sm font-bold text-stone-800 mt-0.5">{formattedStartTime}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="text-xs text-stone-400 font-medium">Fim da Meta ({session.targetHours}h)</div>
                  <div className="text-sm font-bold text-stone-800 mt-0.5">{formattedEndTime}</div>
                </div>
              </div>

              {/* Current Metabolic Phase Card */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Fase Fisiológica Atual: {currentPhase.name}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{currentPhase.metabolicEffect}</p>
                <div className="mt-2.5 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>Janela da fase: {currentPhase.minHours}h - {currentPhase.maxHours}h</span>
                  <span className="font-semibold text-emerald-600">Queima contínua</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-break-fast"
                  onClick={handleFinishClick}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Quebrar Jejum</span>
                </button>

                <button
                  id="btn-adjust-start-time"
                  onClick={() => setShowAdjustModal(true)}
                  className="py-3 px-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-medium transition-colors"
                  title="Ajustar horário de início"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-600 space-y-2">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Como funciona a rotina express:</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Você come na sua janela de <strong>{protocolConfig.eatHours} horas</strong> e descansa o sistema digestivo nas outras <strong>{protocolConfig.fastHours} horas</strong>. Sem necessidade de preparar marmitas complicadas de 3 em 3 horas.
                </p>
                <div className="text-xs text-emerald-700 font-medium pt-1">
                  Permitido durante o jejum: Água pura, café preto sem açúcar, chás naturais e água com gás e limão.
                </div>
              </div>

              {/* Start Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-start-fast"
                  onClick={() => onStartFast(selectedProtocol)}
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Iniciar Jejum Agora</span>
                </button>

                <button
                  id="btn-start-past"
                  onClick={() => setShowAdjustModal(true)}
                  className="py-3.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                >
                  Já comecei antes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Phase Timeline Bar */}
      <div className="mt-8 pt-6 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Linha do Tempo das Fases Metabólicas
          </span>
          <span className="text-xs text-stone-500 font-medium">
            {elapsedHours.toFixed(1)}h decorridas
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {FASTING_PHASES.map((p, idx) => {
            const isCurrent = session.isActive && elapsedHours >= p.minHours && elapsedHours < p.maxHours;
            const isCompleted = session.isActive && elapsedHours >= p.maxHours;
            return (
              <div
                key={p.name}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? "border-stone-900 bg-stone-900 text-white shadow-xs"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-stone-100 bg-stone-50 text-stone-400"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span>{p.minHours}h-{p.maxHours}h</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </div>
                <div className={`text-[11px] font-semibold mt-0.5 line-clamp-1 ${isCurrent ? "text-white" : ""}`}>
                  {p.name.split(" ")[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjust Fast Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Ajustar Início do Jejum</h3>
            <p className="text-xs text-stone-500">
              Esqueceu de acionar o timer logo após a última refeição? Diga quantas horas atrás você parou de comer:
            </p>

            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700">Horas atrás:</label>
              <div className="flex items-center justify-between gap-2">
                {[1, 2, 4, 8, 12].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setAdjustHoursAgo(hrs)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                      adjustHoursAgo === hrs
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {hrs}h atrás
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleStartCustomFast}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Break Fast Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Quebrar o Jejum agora?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Você completou <strong>{elapsedHours.toFixed(1)} horas</strong> de jejum.
              {isGoalReached ? (
                <span className="block mt-1 text-emerald-600 font-semibold">
                  Parabéns! Você bateu sua meta de {session.targetHours}h e somou mais 1 dia ao seu streak! 🔥
                </span>
              ) : (
                <span className="block mt-1 text-amber-600 font-medium">
                  Você ainda não atingiu a meta total ({session.targetHours}h). O jejum será registrado como parcial.
                </span>
              )}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Continuar em Jejum
              </button>
              <button
                type="button"
                onClick={confirmEndFast}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs"
              >
                Finalizar e Comer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
