import React, { useState } from "react";
import {
  Camera,
  Plus,
  Trash2,
  PieChart,
  Flame,
  Utensils,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { MealItem, UserProfile } from "../types";

interface CalorieDeficitSectionProps {
  userProfile: UserProfile;
  meals: MealItem[];
  onOpenPhotoAI: () => void;
  onAddManualMeal: (meal: Omit<MealItem, "id" | "time">) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const CalorieDeficitSection: React.FC<CalorieDeficitSectionProps> = ({
  userProfile,
  meals = [],
  onOpenPhotoAI,
  onAddManualMeal,
  onDeleteMeal,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealCarbs, setMealCarbs] = useState("");
  const [mealFat, setMealFat] = useState("");

  const safeMeals = Array.isArray(meals) ? meals : [];
  const totalCaloriesConsumed = safeMeals.reduce((sum, m) => sum + (m?.calories || 0), 0);
  const totalProtein = safeMeals.reduce((sum, m) => sum + (m?.protein || 0), 0);
  const totalCarbs = safeMeals.reduce((sum, m) => sum + (m?.carbs || 0), 0);
  const totalFat = safeMeals.reduce((sum, m) => sum + (m?.fat || 0), 0);

  const calorieGoal = userProfile.dailyCalorieTarget || 1600;
  const tdee = userProfile.tdee || 2100;
  const remainingCalories = calorieGoal - totalCaloriesConsumed;
  const deficitAchieved = tdee - totalCaloriesConsumed;

  // Calorie consumption percentage
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / calorieGoal) * 100));

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCalories) return;

    onAddManualMeal({
      name: mealName,
      calories: Number(mealCalories),
      protein: Number(mealProtein) || 0,
      carbs: Number(mealCarbs) || 0,
      fat: Number(mealFat) || 0,
      source: "manual",
    });

    setMealName("");
    setMealCalories("");
    setMealProtein("");
    setMealCarbs("");
    setMealFat("");
    setShowManualModal(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Contador de Déficit Diário
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
              TDEE: {tdee} kcal
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Gasto energético calculado automaticamente com déficit seguro para perder gordura sem estresse.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-photo-ai-trigger"
            onClick={onOpenPhotoAI}
            className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Camera className="w-4 h-4" />
            <span>Foto do Prato (IA)</span>
          </button>

          <button
            id="btn-manual-meal-trigger"
            onClick={() => setShowManualModal(true)}
            className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manual</span>
          </button>
        </div>
      </div>

      {/* Real-time Calories and Deficit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {/* Consumed */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
          <div className="text-xs font-medium text-stone-500">Consumido Hoje</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {totalCaloriesConsumed} <span className="text-xs font-normal text-stone-400">kcal</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            De uma meta de <strong>{calorieGoal} kcal</strong> ({caloriePercent}%)
          </div>
        </div>

        {/* Remaining */}
        <div className={`p-4 rounded-xl border ${remainingCalories >= 0 ? "bg-emerald-50/50 border-emerald-200" : "bg-red-50/50 border-red-200"}`}>
          <div className="text-xs font-medium text-stone-600">Restante para a Meta</div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-1 ${remainingCalories >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {remainingCalories >= 0 ? remainingCalories : `+${Math.abs(remainingCalories)}`} <span className="text-xs font-normal">kcal</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {remainingCalories >= 0 ? "Você ainda tem margem hoje" : "Ultrapassou a meta de corte"}
          </div>
        </div>

        {/* Real Deficit vs TDEE */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
          <div className="text-xs font-medium text-amber-900">Déficit Atual vs TDEE</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-1">
            {deficitAchieved > 0 ? `-${deficitAchieved}` : `+${Math.abs(deficitAchieved)}`} <span className="text-xs font-normal">kcal</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {deficitAchieved > 0 ? "Queima de gordura em andamento" : "Em superávit energético"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-stone-600">
          <span>Progresso da meta diária</span>
          <span>{totalCaloriesConsumed} / {calorieGoal} kcal</span>
        </div>
        <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              caloriePercent > 100 ? "bg-red-500" : "bg-emerald-600"
            }`}
            style={{ width: `${Math.min(100, caloriePercent)}%` }}
          />
        </div>
      </div>

      {/* Macronutrient Distribution Bars */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-100">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-700">Proteína</span>
            <span className="font-mono font-bold text-stone-800">{totalProtein}g</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Preservação muscular</div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-700">Carboidratos</span>
            <span className="font-mono font-bold text-stone-800">{totalCarbs}g</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Energia de rápida absorção</div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-700">Gorduras Boas</span>
            <span className="font-mono font-bold text-stone-800">{totalFat}g</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Hormônios e saciedade</div>
        </div>
      </div>

      {/* Logged Meals List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Refeições Registradas Hoje ({meals.length})
          </h3>
          {meals.length > 0 && (
            <span className="text-xs text-stone-400 font-medium">
              Horário da alimentação
            </span>
          )}
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
            <Utensils className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">Nenhuma refeição registrada hoje ainda.</p>
            <p className="text-xs text-stone-400 mt-0.5 max-w-sm mx-auto">
              Tire uma foto do seu prato para a IA estimar os macros ou escolha um dos cardápios expressos.
            </p>
            <button
              onClick={onOpenPhotoAI}
              className="mt-3 py-2 px-4 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
            >
              Fotografar Prato com IA
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3.5 bg-stone-50/70 hover:bg-stone-50 border border-stone-200/80 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {meal.source === "photo_ai" ? <Camera className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-stone-900 line-clamp-1">{meal.name}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                      <span>{meal.time}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">P: {meal.protein}g</span>
                      <span>•</span>
                      <span className="text-amber-600 font-medium">C: {meal.carbs}g</span>
                      <span>•</span>
                      <span className="text-rose-600 font-medium">G: {meal.fat}g</span>
                      {meal.source === "photo_ai" && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                          IA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-stone-900">{meal.calories}</span>
                    <span className="text-xs text-stone-400 ml-0.5">kcal</span>
                  </div>
                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Remover refeição"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-100 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Registrar Refeição Manualmente</h3>
            <p className="text-xs text-stone-500">
              Adicione rapidamente o alimento consumido e seus valores nutricionais estimados.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Nome do prato ou alimento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Frango grelhado com arroz e salada"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">Calorias (kcal) *</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-blue-700 block mb-1">Proteína (g)</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-amber-700 block mb-1">Carbos (g)</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-rose-700 block mb-1">Gordura (g)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={mealFat}
                    onChange={(e) => setMealFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Refeição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
