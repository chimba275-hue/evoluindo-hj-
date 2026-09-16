import React, { useState } from "react";
import {
  X,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { FastingHistoryItem } from "../types";

interface FastingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: FastingHistoryItem[];
  currentStreak: number;
  bestStreak: number;
}

export const FastingHistoryModal: React.FC<FastingHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  currentStreak,
  bestStreak,
}) => {
  const [filter, setFilter] = useState<"all" | "completed" | "partial">("all");

  const safeHistory = Array.isArray(history) ? history : [];
  const completedCount = safeHistory.filter((h) => h?.completed).length;
  const successRate = safeHistory.length > 0 ? Math.round((completedCount / safeHistory.length) * 100) : 100;
  const totalHours = safeHistory.reduce((sum, h) => sum + (h?.actualHours || 0), 0);
  const averageHours = safeHistory.length > 0 ? (totalHours / safeHistory.length).toFixed(1) : "0";

  const filteredHistory = safeHistory.filter((h) => {
    if (filter === "completed") return h?.completed;
    if (filter === "partial") return !h?.completed;
    return true;
  });

  const badges = [
    { title: "Iniciante Consciente", days: 3, unlocked: bestStreak >= 3, desc: "3 dias seguidos batendo a janela" },
    { title: "Guerreiro da Queima", days: 7, unlocked: bestStreak >= 7, desc: "7 dias em cetose controlada" },
    { title: "Mestre da Autofagia", days: 14, unlocked: bestStreak >= 14, desc: "14 dias de disciplina metabólica" },
    { title: "Transformação Total", days: 30, unlocked: bestStreak >= 30, desc: "1 mês consistente sem efeito sanfona" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                Histórico de Jejuns & Streaks
              </h3>
              <p className="text-xs text-stone-500">
                Últimos registros, consistência e badges conquistados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[11px] font-medium text-stone-500">Streak Atual</div>
            <div className="text-xl font-extrabold text-stone-900 mt-0.5 flex items-center gap-1">
              <span>{currentStreak} dias</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[11px] font-medium text-stone-500">Recorde Pessoal</div>
            <div className="text-xl font-extrabold text-stone-900 mt-0.5">
              {bestStreak} dias
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[11px] font-medium text-stone-500">Taxa de Sucesso</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
              {successRate}%
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="text-[11px] font-medium text-stone-500">Média de Duração</div>
            <div className="text-xl font-extrabold text-stone-900 mt-0.5">
              {averageHours}h
            </div>
          </div>
        </div>

        {/* Gamification Badges Carousel / Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Conquistas e Gamificação:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.title}
                className={`p-3 rounded-xl border text-center transition-all ${
                  b.unlocked
                    ? "bg-amber-50/60 border-amber-300 text-stone-900"
                    : "bg-stone-50 border-stone-200 opacity-60 text-stone-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center mb-1.5 ${
                    b.unlocked ? "bg-amber-400 text-white shadow-xs" : "bg-stone-200 text-stone-400"
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold line-clamp-1">{b.title}</div>
                <div className="text-[10px] text-stone-500 mt-0.5">{b.days} dias consecutivos</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-stone-700">
            Histórico ({filteredHistory.length} registros)
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "completed" ? "bg-emerald-600 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              Completos
            </button>
            <button
              onClick={() => setFilter("partial")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filter === "partial" ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              Parciais
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-2.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <span>Protocolo {item.protocol}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.completed ? "Completo" : "Parcial"}
                    </span>
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    Data: {item.date} • Meta: {item.targetHours}h
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-stone-900 font-mono">
                  {item.actualHours}h
                </div>
                <div className="text-[10px] text-stone-400">Duração real</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
