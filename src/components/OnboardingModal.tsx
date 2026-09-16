import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Flame,
  Zap,
  Clock,
  Target,
} from "lucide-react";
import { FastingProtocolType, UserProfile } from "../types";
import {
  calculateBMR,
  calculateCalorieTarget,
  calculateTDEE,
  calculateWaterTarget,
  calculateTargetDate,
} from "../utils/calculations";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [gender, setGender] = useState<"male" | "female">(currentProfile.gender || "female");
  const [age, setAge] = useState(currentProfile.age.toString());
  const [heightCm, setHeightCm] = useState(currentProfile.heightCm.toString());
  const [currentWeight, setCurrentWeight] = useState(currentProfile.currentWeight.toString());
  const [goalWeight, setGoalWeight] = useState(currentProfile.goalWeight.toString());
  const [activityLevel, setActivityLevel] = useState<UserProfile["activityLevel"]>(
    currentProfile.activityLevel || "light"
  );
  const [protocol, setProtocol] = useState<FastingProtocolType>(
    currentProfile.preferredProtocol || "16:8"
  );
  const [lossPace, setLossPace] = useState<UserProfile["lossPace"]>(
    currentProfile.lossPace || "firm"
  );

  const numWeight = parseFloat(currentWeight) || 75;
  const numHeight = parseFloat(heightCm) || 170;
  const numAge = parseInt(age, 10) || 30;
  const numGoal = parseFloat(goalWeight) || 68;

  // Real-time calculation preview
  const previewBmr = calculateBMR(numWeight, numHeight, numAge, gender);
  const previewTdee = calculateTDEE(previewBmr, activityLevel);
  const previewTargetCalories = calculateCalorieTarget(previewTdee, previewBmr, gender, lossPace);
  const previewWater = calculateWaterTarget(numWeight);
  const previewTargetWeeks = calculateTargetDate(numWeight, numGoal, lossPace);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      gender,
      age: numAge,
      heightCm: numHeight,
      currentWeight: numWeight,
      initialWeight: currentProfile.initialWeight || numWeight,
      goalWeight: numGoal,
      activityLevel,
      preferredProtocol: protocol,
      lossPace,
      bmr: previewBmr,
      tdee: previewTdee,
      dailyCalorieTarget: previewTargetCalories,
      dailyWaterTargetMl: previewWater,
      targetDateEstimate: previewTargetWeeks,
      onboarded: true,
    };

    onSaveProfile(updatedProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Setup Rápido em 30s
              </span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-1">
              Onboarding & Cálculo de TDEE Automático
            </h3>
            <p className="text-xs text-stone-500">
              Personalize sua meta calórica e protocolo de jejum sem fórmulas complicadas.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Sexo Biológico *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                    gender === "female"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  Feminino
                </button>
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                    gender === "male"
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  Masculino
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Idade *</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Height, Current Weight, Goal Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Altura (cm) *</label>
              <input
                type="number"
                required
                placeholder="170"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Peso Atual (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="79.4"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-emerald-700 block mb-1">Meta de Peso (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="69.0"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Nível de Atividade Diária:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "sedentary", title: "Sedentário", desc: "Trabalho sentado" },
                { id: "light", title: "Leve", desc: "Caminhadas leves" },
                { id: "moderate", title: "Moderado", desc: "Treino 3-4x/sem" },
                { id: "very_active", title: "Ativo", desc: "Treino diário" },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setActivityLevel(act.id as any)}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-colors ${
                    activityLevel === act.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600"
                      : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <div>{act.title}</div>
                  <div className="text-[10px] text-stone-400 font-normal">{act.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Protocol & Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Protocolo de Jejum Favorito:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(["16:8", "18:6", "20:4", "OMAD"] as FastingProtocolType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProtocol(p)}
                    className={`py-2 text-center rounded-xl border text-xs font-bold transition-colors ${
                      protocol === p
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                Ritmo Desejado de Perda:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "moderate", label: "Moderado", rate: "-0.5kg/sem" },
                  { id: "firm", label: "Firme", rate: "-0.75kg/sem" },
                  { id: "aggressive", label: "Agressivo", rate: "-1.0kg/sem" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLossPace(l.id as any)}
                    className={`py-1.5 px-1 text-center rounded-xl border text-xs transition-colors ${
                      lossPace === l.id
                        ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    <div className="text-[11px]">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Calculated Results Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Resultados Calculados pela IA:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-stone-500 font-medium">BMR (Basal)</div>
                <div className="text-base font-extrabold text-stone-900">{previewBmr} kcal</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-stone-500 font-medium">TDEE Total</div>
                <div className="text-base font-extrabold text-stone-900">{previewTdee} kcal</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-emerald-700 font-semibold">Meta de Calorias</div>
                <div className="text-base font-extrabold text-emerald-700">{previewTargetCalories} kcal</div>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                <div className="text-[10px] text-cyan-700 font-semibold">Meta de Água</div>
                <div className="text-base font-extrabold text-cyan-700">{previewWater} ml</div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Salvar Perfil e Aplicar Metas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
