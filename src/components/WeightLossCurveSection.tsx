import React, { useState } from "react";
import {
  TrendingDown,
  Plus,
  Scale,
  Calendar,
  Target,
  Award,
  ChevronRight,
  Info,
} from "lucide-react";
import { UserProfile, WeightLog } from "../types";
import { calculateCalorieTarget, calculateTargetDate } from "../utils/calculations";

interface WeightLossCurveSectionProps {
  userProfile: UserProfile;
  weightLogs: WeightLog[];
  onAddWeightLog: (weight: number, date: string, note?: string) => void;
  onUpdateGoalSettings: (newGoal: number, newPace: "moderate" | "firm" | "aggressive") => void;
}

export const WeightLossCurveSection: React.FC<WeightLossCurveSectionProps> = ({
  userProfile,
  weightLogs,
  onAddWeightLog,
  onUpdateGoalSettings,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState(userProfile.currentWeight.toString());
  const [logNote, setLogNote] = useState("");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(userProfile.goalWeight.toString());
  const [paceInput, setPaceInput] = useState<"moderate" | "firm" | "aggressive">(userProfile.lossPace);

  const initialWeight = userProfile.initialWeight || 84.0;
  const currentWeight = userProfile.currentWeight || 79.4;
  const goalWeight = userProfile.goalWeight || 69.0;

  const totalLost = Number((initialWeight - currentWeight).toFixed(1));
  const totalToLose = Math.max(0.1, initialWeight - goalWeight);
  const percentCompleted = Math.min(100, Math.max(0, Math.round((totalLost / totalToLose) * 100)));
  const remainingKg = Math.max(0, Number((currentWeight - goalWeight).toFixed(1)));

  // SVG Chart calculation
  const safeLogs = Array.isArray(weightLogs) && weightLogs.length > 0 ? weightLogs : [
    { id: "def", date: new Date().toISOString().split("T")[0], weight: currentWeight, note: "Peso atual" }
  ];
  const sortedLogs = [...safeLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const minWeight = Math.min(...sortedLogs.map((l) => l.weight), goalWeight) - 2;
  const maxWeight = Math.max(...sortedLogs.map((l) => l.weight), initialWeight) + 2;
  const weightRange = Math.max(1, maxWeight - minWeight);

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = sortedLogs.map((log, idx) => {
    const x = paddingX + (idx / Math.max(1, sortedLogs.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((log.weight - minWeight) / weightRange) * (svgHeight - paddingY * 2);
    return { x, y, weight: log.weight, date: log.date, note: log.note };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Goal y line
  const goalY = svgHeight - paddingY - ((goalWeight - minWeight) / weightRange) * (svgHeight - paddingY * 2);

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30) {
      onAddWeightLog(val, new Date().toISOString().split("T")[0], logNote || undefined);
      setShowLogModal(false);
      setLogNote("");
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(goalInput);
    if (!isNaN(val) && val > 30) {
      onUpdateGoalSettings(val, paceInput);
      setShowGoalModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Curva de Emagrecimento & Metas
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {percentCompleted}% da Meta
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Acompanhamento contínuo da perda de gordura sem oscilações de dietas radicais.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-register-weight"
            onClick={() => setShowLogModal(true)}
            className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Peso</span>
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Ajustar Meta</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-xs font-medium text-stone-500">Peso Inicial</div>
          <div className="text-xl font-extrabold text-stone-900 mt-0.5">
            {initialWeight} <span className="text-xs font-normal text-stone-400">kg</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Ponto de partida</div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-xs font-medium text-stone-500">Peso Atual</div>
          <div className="text-xl font-extrabold text-stone-900 mt-0.5">
            {currentWeight} <span className="text-xs font-normal text-stone-400">kg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Última pesagem</div>
        </div>

        <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
          <div className="text-xs font-medium text-emerald-800">Total Perdido</div>
          <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
            -{totalLost} <span className="text-xs font-normal text-emerald-600">kg</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {percentCompleted}% atingido
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
          <div className="text-xs font-medium text-stone-500">Meta Final</div>
          <div className="text-xl font-extrabold text-stone-900 mt-0.5">
            {goalWeight} <span className="text-xs font-normal text-stone-400">kg</span>
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            Faltam <strong>{remainingKg} kg</strong> ({calculateTargetDate(currentWeight, goalWeight, userProfile.lossPace)})
          </div>
        </div>
      </div>

      {/* Interactive Weight Curve SVG Chart */}
      <div className="mt-6 p-4 rounded-2xl border border-stone-200 bg-stone-50/50">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold text-stone-700 uppercase tracking-wider">
            Evolução Gráfica (kg)
          </span>
          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Peso Real
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-dashed bg-rose-500 inline-block border-t border-dashed border-rose-500" /> Meta ({goalWeight} kg)
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-56 text-stone-800"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + ratio * (svgHeight - paddingY * 2);
              const val = (maxWeight - ratio * weightRange).toFixed(0);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    fontSize="10"
                    fill="#9ca3af"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val}k
                  </text>
                </g>
              );
            })}

            {/* Target Line */}
            {goalY >= paddingY && goalY <= svgHeight - paddingY && (
              <line
                x1={paddingX}
                y1={goalY}
                x2={svgWidth - paddingX}
                y2={goalY}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
            )}

            {/* Weight Evolution Line */}
            {polylinePoints && (
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
            )}

            {/* Points and circles */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className="fill-emerald-600 stroke-white stroke-2 group-hover:r-7 transition-all"
                />
                {/* Value tooltip label on point */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#1c1917"
                  textAnchor="middle"
                >
                  {p.weight}
                </text>
                {/* Date on bottom */}
                <text
                  x={p.x}
                  y={svgHeight - 10}
                  fontSize="9"
                  fill="#78716c"
                  textAnchor="middle"
                >
                  {p.date.slice(5)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Register Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Registrar Pesagem de Hoje</h3>
            <p className="text-xs text-stone-500">
              Dica recomendada: pese-se sempre pela manhã, em jejum e após ir ao banheiro para maior precisão.
            </p>

            <form onSubmit={handleWeightSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Peso em kg *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 78.5"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Observação (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: após 16h de jejum, treino de perna ontem..."
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Ajustar Meta & Ritmo Semanal</h3>
            <p className="text-xs text-stone-500">
              Ajuste seu peso desejado e o ritmo sustentável de queima calórica.
            </p>

            <form onSubmit={handleGoalSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Meta de Peso Final (kg) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Ritmo semanal de perda:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "moderate", label: "Moderado", rate: "-0.5kg/sem" },
                    { id: "firm", label: "Firme", rate: "-0.75kg/sem" },
                    { id: "aggressive", label: "Agressivo", rate: "-1.0kg/sem" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaceInput(p.id as any)}
                      className={`p-2 rounded-xl text-center border text-xs transition-colors ${
                        paceInput === p.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold"
                          : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[10px] text-stone-400">{p.rate}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Atualizar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
