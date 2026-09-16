import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  X,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  Volume2,
  Trophy,
  Crown,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WorkoutRoutine, WorkoutExercise, PremiumAccessState } from "../types";
import { WORKOUT_ROUTINES } from "../data/initialData";
import { soundFx } from "../utils/sound";

interface WorkoutsSectionProps {
  onOpenChallengeTab?: () => void;
  onOpenPaywall?: () => void;
  premiumState?: PremiumAccessState;
}

export const WorkoutsSection: React.FC<WorkoutsSectionProps> = ({
  onOpenChallengeTab,
  onOpenPaywall,
  premiumState,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRoutine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeRoutine = selectedWorkout;
  const currentExercise: WorkoutExercise | null =
    activeRoutine && activeRoutine.exercises[exerciseIndex]
      ? activeRoutine.exercises[exerciseIndex]
      : null;

  const nextExerciseName =
    activeRoutine && activeRoutine.exercises[exerciseIndex + 1]
      ? activeRoutine.exercises[exerciseIndex + 1].name
      : activeRoutine && currentRound < activeRoutine.rounds
      ? activeRoutine.exercises[0].name
      : "Fim do Treino!";

  // Start workout player
  const startWorkout = (workout: WorkoutRoutine) => {
    setSelectedWorkout(workout);
    setCurrentRound(1);
    setExerciseIndex(0);
    setIsWorkPhase(true);
    setSecondsLeft(workout.exercises[0].workSeconds);
    setIsPlaying(true);
    setIsCompleted(false);
    soundFx.playWorkStart();
  };

  // Close workout player
  const closePlayer = () => {
    setIsPlaying(false);
    setSelectedWorkout(null);
    setIsCompleted(false);
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying || !selectedWorkout || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          soundFx.playCountdownBeep(prev === 2 ? 800 : 600, 0.1);
        }

        if (prev <= 1) {
          // Transition phase
          if (isWorkPhase) {
            // Move to Rest phase
            const restTime = currentExercise?.restSeconds || 10;
            if (restTime > 0) {
              setIsWorkPhase(false);
              soundFx.playRestStart();
              return restTime;
            } else {
              // No rest, advance exercise immediately
              advanceExercise();
              return 0;
            }
          } else {
            // Rest ended, advance exercise
            advanceExercise();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, selectedWorkout, isWorkPhase, currentExercise, isCompleted, exerciseIndex, currentRound]);

  const advanceExercise = () => {
    if (!selectedWorkout) return;

    if (exerciseIndex + 1 < selectedWorkout.exercises.length) {
      // Next exercise in same round
      const nextIdx = exerciseIndex + 1;
      setExerciseIndex(nextIdx);
      setIsWorkPhase(true);
      setSecondsLeft(selectedWorkout.exercises[nextIdx].workSeconds);
      soundFx.playWorkStart();
    } else if (currentRound < selectedWorkout.rounds) {
      // Next round
      setCurrentRound((r) => r + 1);
      setExerciseIndex(0);
      setIsWorkPhase(true);
      setSecondsLeft(selectedWorkout.exercises[0].workSeconds);
      soundFx.playWorkStart();
    } else {
      // Finish
      setIsPlaying(false);
      setIsCompleted(true);
      soundFx.playVictory();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const skipNext = () => {
    advanceExercise();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Treinos Express (HIIT, Tabata e EMOM)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              8 a 20 Minutos
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Queima calórica máxima em mínimo tempo. Sem equipamento de academia e com timer sonoro integrado.
          </p>
        </div>

        {onOpenChallengeTab && (
          <button
            onClick={onOpenChallengeTab}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-all shadow-xs"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Ver Desafio 30 Dias</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 30-Day Program Callout Card */}
      {onOpenChallengeTab && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-950">
                Programa Oficial
              </span>
              <span className="text-xs font-bold text-amber-300">
                Treinos diários progressivos
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Quer um cronograma completo de 30 dias para transformar o corpo?
            </h3>
            <p className="text-xs text-stone-300">
              Combine jejum intermitente estratégico com rotinas diárias de 8 a 15 minutos e acompanhamento passo a passo.
            </p>
          </div>

          <button
            onClick={onOpenChallengeTab}
            className="shrink-0 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Acessar Cronograma dos 30 Dias</span>
          </button>
        </div>
      )}

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {WORKOUT_ROUTINES.map((routine) => (
          <div
            key={routine.id}
            className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-stone-900 text-white">
                  {routine.tag}
                </span>
                <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  ~{routine.caloriesBurn} kcal
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900">{routine.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">{routine.description}</p>
              </div>

              {/* Meta stats */}
              <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {routine.durationMin} min
                </span>
                <span>•</span>
                <span>{routine.rounds} voltas</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">{routine.level}</span>
              </div>

              {/* Exercises list mini */}
              <div className="pt-2 border-t border-stone-200/60">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Exercícios:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {routine.exercises.map((ex, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 bg-white border border-stone-200 rounded-md text-stone-700"
                    >
                      {ex.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="pt-4 mt-2">
              <button
                type="button"
                onClick={() => startWorkout(routine)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Iniciar Treino com Timer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Workout Timer Player Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-center relative overflow-hidden">
            {/* Top control bar */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900">{selectedWorkout.title}</span>
                <span>•</span>
                <span>Volta {currentRound} de {selectedWorkout.rounds}</span>
              </div>
              <button
                onClick={closePlayer}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isCompleted ? (
              <>
                {/* Phase Indicator Banner */}
                <div
                  className={`py-1.5 px-4 rounded-full text-xs font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 ${
                    isWorkPhase
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isWorkPhase ? "TRABALHO INTENSO" : "DESCANSO / RESPIRE"}</span>
                </div>

                {/* Big Countdown Timer Circle */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
                  <div
                    className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-colors duration-500 shadow-inner ${
                      isWorkPhase
                        ? "bg-gradient-to-b from-emerald-50 to-emerald-100/50 border-4 border-emerald-500"
                        : "bg-gradient-to-b from-amber-50 to-amber-100/50 border-4 border-amber-500"
                    }`}
                  >
                    <div className="text-5xl sm:text-6xl font-black text-stone-900 font-mono tracking-tighter">
                      {secondsLeft}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-1">
                      segundos
                    </div>
                  </div>
                </div>

                {/* Exercise Info */}
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
                    {currentExercise?.name}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    {currentExercise?.instruction}
                  </p>
                  <div className="text-[11px] text-stone-400 pt-1">
                    A seguir: <strong className="text-stone-700">{nextExerciseName}</strong>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-lg transition-transform active:scale-95"
                    title={isPlaying ? "Pausar" : "Continuar"}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={skipNext}
                    className="p-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                    title="Pular intervalo"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              /* Completed View */
              <div className="py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-stone-900">Treino Concluído! 🎉</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Você gastou ~{selectedWorkout.caloriesBurn} calorias e ativou o metabolismo de queima prolongada para o restante do dia!
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={closePlayer}
                    className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs"
                  >
                    Voltar aos Treinos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
