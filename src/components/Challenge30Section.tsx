import React, { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Droplets,
  Heart,
  Award,
  Crown,
  Zap,
  ArrowRight,
} from "lucide-react";
import { ChallengeDay, PremiumAccessState } from "../types";
import { CHALLENGE_30_DAYS } from "../data/challengeData";

interface Challenge30SectionProps {
  premiumState: PremiumAccessState;
  onOpenPaywall: (offer?: "challenge_30" | "all_access") => void;
  onSelectWorkoutTab?: () => void;
  onSelectTimerTab?: () => void;
}

export const Challenge30Section: React.FC<Challenge30SectionProps> = ({
  premiumState,
  onOpenPaywall,
  onSelectWorkoutTab,
  onSelectTimerTab,
}) => {
  const isUnlocked = premiumState.isVipMember || premiumState.unlockedChallenge30;

  // Track completed tasks in localStorage
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("evoluindo_challenge_tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");

  useEffect(() => {
    try {
      localStorage.setItem("evoluindo_challenge_tasks", JSON.stringify(completedTaskIds));
    } catch (e) {
      console.warn("Error saving challenge tasks", e);
    }
  }, [completedTaskIds]);

  const toggleTask = (taskId: string, dayNumber: number) => {
    // If locked day and not unlocked, show paywall
    if (dayNumber > 3 && !isUnlocked) {
      onOpenPaywall("challenge_30");
      return;
    }

    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Calculate stats
  const totalDays = CHALLENGE_30_DAYS.length;
  const completedDaysCount = CHALLENGE_30_DAYS.filter((day) =>
    day.tasks.every((t) => completedTaskIds.includes(t.id))
  ).length;
  const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

  const selectedDay = CHALLENGE_30_DAYS.find((d) => d.dayNumber === selectedDayNumber) || CHALLENGE_30_DAYS[0];
  const isSelectedDayLocked = selectedDay.dayNumber > 3 && !isUnlocked;

  // Filter days by phase
  const filteredDays = CHALLENGE_30_DAYS.filter((day) => {
    if (selectedPhase === "fase1") return day.dayNumber <= 7;
    if (selectedPhase === "fase2") return day.dayNumber >= 8 && day.dayNumber <= 14;
    if (selectedPhase === "fase3") return day.dayNumber >= 15 && day.dayNumber <= 21;
    if (selectedPhase === "fase4") return day.dayNumber >= 22;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero / Banner Dashboard */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
        {/* Background Subtle Pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400 text-stone-950 shadow-xs">
                <Trophy className="w-3.5 h-3.5 text-stone-950" />
                Programa Oficial
              </span>

              {isUnlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Crown className="w-3.5 h-3.5 text-emerald-400" />
                  Acesso Completo Liberado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-stone-700/60 text-stone-300 border border-stone-600">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Dias 1 a 3 Grátis • Dias 4 a 30 VIP
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Desafio 30 Dias: Corpo Definido
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Cronograma diário de transformação física: queima de gordura visceral, definição muscular e disciplina inabalável sem passar fome.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-stone-800/80 backdrop-blur-md rounded-2xl p-5 border border-stone-700/80 shrink-0 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-bold uppercase tracking-wider">Progresso do Desafio</span>
              <span className="text-amber-400 font-extrabold text-sm">{progressPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-300 pt-1">
              <span>{completedDaysCount} de 30 dias concluídos</span>
              {progressPercent === 100 ? (
                <span className="text-amber-400 font-black flex items-center gap-1">
                  <Award className="w-4 h-4" /> Campeão 🏆
                </span>
              ) : (
                <span className="text-stone-400">{30 - completedDaysCount} dias restantes</span>
              )}
            </div>

            {!isUnlocked && (
              <button
                onClick={() => onOpenPaywall("challenge_30")}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 mt-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Desbloquear 30 Dias (R$ 29,90)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedPhase("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhase === "all"
              ? "bg-stone-900 text-white shadow-xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Todos os 30 Dias
        </button>
        <button
          onClick={() => setSelectedPhase("fase1")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhase === "fase1"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Fase 1: Desinflamar (1-7)
        </button>
        <button
          onClick={() => setSelectedPhase("fase2")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhase === "fase2"
              ? "bg-orange-700 text-white shadow-xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Fase 2: Acelerar (8-14)
        </button>
        <button
          onClick={() => setSelectedPhase("fase3")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhase === "fase3"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Fase 3: Definir (15-21)
        </button>
        <button
          onClick={() => setSelectedPhase("fase4")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedPhase === "fase4"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          Fase 4: Lapidar (22-30)
        </button>
      </div>

      {/* Main Grid: Days Timeline Selector (Left) & Active Day Detail View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Days Selector Carousel/Grid (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-800">
              Cronograma de Dias ({filteredDays.length})
            </h3>
            <span className="text-[11px] text-stone-500">
              Clique em um dia para ver as missões
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredDays.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              const isLocked = day.dayNumber > 3 && !isUnlocked;
              const isDayFinished = day.tasks.every((t) => completedTaskIds.includes(t.id));

              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                        isDayFinished
                          ? "bg-emerald-600 text-white"
                          : isLocked
                          ? "bg-stone-100 text-stone-400 border border-stone-200"
                          : "bg-stone-900 text-white"
                      }`}
                    >
                      {isDayFinished ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-amber-600" />
                      ) : (
                        `D${day.dayNumber}`
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          Dia {day.dayNumber}: {day.title}
                        </span>
                        {day.dayNumber <= 3 && !isUnlocked && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                            Grátis
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{day.workoutType} ({day.workoutDurationMin}m)</span>
                        <span>•</span>
                        <span>{day.fastingTarget.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {isDayFinished ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Feito
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Day Missions & Workout Panel (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6 relative overflow-hidden">
            {/* Top Bar for Selected Day */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Dia {selectedDay.dayNumber} de 30
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {selectedDay.phase}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                  {selectedDay.title}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Foco: <strong className="text-stone-700">{selectedDay.focus}</strong>
                </p>
              </div>

              {selectedDay.dayNumber <= 3 && !isUnlocked ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  🎁 Degustação Liberada
                </span>
              ) : isSelectedDayLocked ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Dia VIP Bloqueado
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Acesso Total
                </span>
              )}
            </div>

            {/* If Day is Locked by Paywall, Show Attractive Paywall Gate Overlay */}
            {isSelectedDayLocked ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-stone-50 to-amber-50/50 border border-amber-200 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-md">
                  <Crown className="w-7 h-7" />
                </div>

                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-lg font-black text-stone-900">
                    Desbloqueie o Dia {selectedDay.dayNumber} e Todo o Desafio 30 Dias
                  </h3>
                  <p className="text-xs text-stone-600">
                    Você completou os dias de degustação gratuita! Para continuar transformando seu corpo e acessar todos os 30 dias de treinos progressivos, missões e troféu final, desbloqueie agora:
                  </p>
                </div>

                {/* Sneak Peek Preview of Day */}
                <div className="bg-white/80 backdrop-blur-xs p-4 rounded-xl border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="font-bold text-stone-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Prévia do Dia {selectedDay.dayNumber}:</span>
                  </div>
                  <div className="text-stone-600">
                    • <strong>Treino:</strong> {selectedDay.workoutTitle} ({selectedDay.workoutDurationMin} min - {selectedDay.workoutType})
                  </div>
                  <div className="text-stone-600">
                    • <strong>Meta de Jejum:</strong> {selectedDay.fastingTarget}
                  </div>
                  <div className="text-stone-600">
                    • <strong>Dica Especial:</strong> {selectedDay.tipOfTheDay}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onOpenPaywall("challenge_30")}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Desbloquear Desafio 30 Dias (R$ 29,90)</span>
                  </button>

                  <button
                    onClick={() => onOpenPaywall("all_access")}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>evoluindo+ VIP Completo (R$ 47,00)</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Protocol Glance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Fasting Protocol of the Day */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold uppercase text-stone-500">
                        Protocolo de Jejum
                      </div>
                      <div className="text-sm font-black text-stone-900 mt-0.5">
                        {selectedDay.fastingTarget}
                      </div>
                      <button
                        onClick={onSelectTimerTab}
                        className="text-[11px] font-bold text-emerald-700 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        Abrir Cronômetro de Jejum <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Workout of the Day */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-bold uppercase text-stone-500">
                        Treino Sugerido ({selectedDay.workoutDurationMin} min)
                      </div>
                      <div className="text-sm font-black text-stone-900 mt-0.5">
                        {selectedDay.workoutTitle}
                      </div>
                      <button
                        onClick={onSelectWorkoutTab}
                        className="text-[11px] font-bold text-orange-700 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        Ver Treino no Player <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tip of the Day Box */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-700">
                    <strong className="text-stone-900 block font-bold mb-0.5">
                      Dica Estratégica do Dia {selectedDay.dayNumber}:
                    </strong>
                    {selectedDay.tipOfTheDay}
                  </div>
                </div>

                {/* Day Tasks Checklist */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                      Missões Obrigatórias do Dia ({selectedDay.tasks.filter((t) => completedTaskIds.includes(t.id)).length}/{selectedDay.tasks.length})
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Marque para contabilizar seu progresso
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedDay.tasks.map((task) => {
                      const isDone = completedTaskIds.includes(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id, selectedDay.dayNumber)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isDone
                              ? "bg-emerald-50/80 border-emerald-300 text-stone-900"
                              : "bg-stone-50 hover:bg-white border-stone-200 text-stone-800"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isDone
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-4 h-4" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isDone ? "line-through text-stone-500" : "text-stone-900"
                                }`}
                              >
                                {task.title}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm bg-stone-200 text-stone-700">
                                {task.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day Completion Celebration Banner */}
                {selectedDay.tasks.every((t) => completedTaskIds.includes(t.id)) && (
                  <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between gap-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black">
                          Dia {selectedDay.dayNumber} 100% Concluído! 🎉
                        </h4>
                        <p className="text-xs text-emerald-100">
                          Excelente trabalho! O seu corpo e metabolismo agradecem a dedicação.
                        </p>
                      </div>
                    </div>
                    {selectedDay.dayNumber < 30 && (
                      <button
                        onClick={() => setSelectedDayNumber((d) => Math.min(30, d + 1))}
                        className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0"
                      >
                        Próximo Dia →
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
