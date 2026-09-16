import React from "react";
import {
  Droplets,
  Plus,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { WaterEntry } from "../types";
import { soundFx } from "../utils/sound";

interface WaterTrackerSectionProps {
  currentWaterMl: number;
  targetWaterMl: number;
  waterLogs: WaterEntry[];
  onAddWater: (amountMl: number) => void;
  onResetWater: () => void;
  onDeleteLog: (id: string) => void;
}

export const WaterTrackerSection: React.FC<WaterTrackerSectionProps> = ({
  currentWaterMl,
  targetWaterMl,
  waterLogs,
  onAddWater,
  onResetWater,
  onDeleteLog,
}) => {
  const percent = Math.min(100, Math.round((currentWaterMl / Math.max(1, targetWaterMl)) * 100));
  const isGoalReached = currentWaterMl >= targetWaterMl;

  const quickAmounts = [
    { label: "Copo", amount: 200 },
    { label: "Caneca", amount: 350 },
    { label: "Garrafinha", amount: 500 },
    { label: "Garrafão", amount: 1000 },
  ];

  const handleAdd = (amount: number) => {
    const nextAmount = currentWaterMl + amount;
    if (!isGoalReached && nextAmount >= targetWaterMl) {
      soundFx.playVictory();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    onAddWater(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Tracker de Água & Eletrólitos
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              Meta: {targetWaterMl} ml
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Meta calculada por peso corporal (35ml por kg). Fundamental para a queima e saciedade no jejum.
          </p>
        </div>

        {currentWaterMl > 0 && (
          <button
            onClick={onResetWater}
            className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zerar hoje</span>
          </button>
        )}
      </div>

      {/* Main Interactive Display */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Visual Water Tank Indicator */}
        <div className="flex flex-col items-center justify-center p-6 bg-cyan-50/40 rounded-2xl border border-cyan-100">
          <div className="relative w-28 h-40 bg-white rounded-3xl border-3 border-cyan-200 overflow-hidden shadow-inner flex items-end">
            {/* Water liquid animation */}
            <div
              className="w-full bg-gradient-to-t from-cyan-600 to-sky-400 transition-all duration-700 rounded-b-2xl relative"
              style={{ height: `${percent}%` }}
            >
              {/* Wave shimmer */}
              <div className="absolute inset-x-0 top-0 h-2 bg-white/30" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <Droplets className={`w-5 h-5 mb-1 ${percent > 50 ? "text-white" : "text-cyan-600"}`} />
              <span className={`text-xl font-black font-mono ${percent > 50 ? "text-white" : "text-stone-900"}`}>
                {percent}%
              </span>
            </div>
          </div>

          <div className="text-center mt-3">
            <div className="text-lg font-extrabold text-stone-900">
              {currentWaterMl} <span className="text-xs font-normal text-stone-400">/ {targetWaterMl} ml</span>
            </div>
            {isGoalReached ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Meta Batida!
              </span>
            ) : (
              <span className="text-xs text-stone-500 mt-0.5">
                Restam {Math.max(0, targetWaterMl - currentWaterMl)} ml
              </span>
            )}
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Registro Rápido em 1 Toque:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {quickAmounts.map((q) => (
                <button
                  key={q.amount}
                  id={`btn-add-water-${q.amount}`}
                  onClick={() => handleAdd(q.amount)}
                  className="p-3 bg-stone-50 hover:bg-cyan-50 hover:border-cyan-300 border border-stone-200 rounded-xl text-center transition-all group active:scale-95"
                >
                  <div className="text-xs font-bold text-stone-700 group-hover:text-cyan-700">
                    +{q.amount} ml
                  </div>
                  <div className="text-[11px] text-stone-400 group-hover:text-cyan-600 mt-0.5">
                    {q.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fasting Tip Banner */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Dica de Ouro no Jejum Intermitente:</span>
            </div>
            <p className="leading-relaxed">
              Durante o jejum, os rins excretam sódio com mais rapidez devido à baixa insulina. Se você sentir fraqueza, dor de cabeça ou tontura no trabalho, coloque <strong>uma pitada de sal marinho ou sal rosa</strong> em um copo com água ou água com gás e limão. O alívio é quase imediato!
            </p>
          </div>
        </div>
      </div>

      {/* Water Logs Today List */}
      {waterLogs.length > 0 && (
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Ingestões registradas hoje ({waterLogs.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {waterLogs.map((log) => (
              <div
                key={log.id}
                className="px-3 py-1.5 rounded-lg bg-cyan-50/60 border border-cyan-100 text-xs font-medium text-cyan-900 flex items-center gap-2"
              >
                <span>+{log.amountMl} ml</span>
                <span className="text-[10px] text-cyan-600 font-normal">{log.timestamp}</span>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-cyan-400 hover:text-red-500 ml-1"
                  title="Desfazer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
