import React, { useState } from "react";
import {
  Utensils,
  Clock,
  Sparkles,
  Check,
  Plus,
  Flame,
  ChevronRight,
  ShieldCheck,
  Crown,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { DietPlan, MealItem, RecipeMeal, PremiumAccessState } from "../types";
import { DIET_PLANS } from "../data/initialData";
import { VIP_DIET_PLANS } from "../data/vipPlansData";

interface MealPlansSectionProps {
  onAddMealToDiary: (meal: Omit<MealItem, "id" | "time">) => void;
  premiumState: PremiumAccessState;
  onOpenPaywall: (offer?: "vip_plans" | "all_access") => void;
}

export const MealPlansSection: React.FC<MealPlansSectionProps> = ({
  onAddMealToDiary,
  premiumState,
  onOpenPaywall,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("low_carb");
  const [addedMealName, setAddedMealName] = useState<string | null>(null);

  const allPlans: DietPlan[] = [...DIET_PLANS, ...VIP_DIET_PLANS];
  const activePlan = allPlans.find((p) => p.id === selectedPlanId) || allPlans[0];

  const isPlanUnlocked =
    !activePlan.isVip ||
    premiumState.isVipMember ||
    premiumState.unlockedPlans.includes(activePlan.id);

  const handleLogRecipe = (recipe: RecipeMeal) => {
    if (!isPlanUnlocked) {
      onOpenPaywall("vip_plans");
      return;
    }

    onAddMealToDiary({
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      source: "cardapio",
    });

    setAddedMealName(recipe.name);
    setTimeout(() => {
      setAddedMealName(null);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Cardápios & Protocolos Alimentares
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Preparo em &lt; 15 min
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Planejados com alta saciedade e pouca louça. Escolha entre os cardápios essenciais ou os protocolos VIP de quebra de platô.
          </p>
        </div>

        {/* VIP Upsell Badge if not member */}
        {!premiumState.isVipMember && (
          <button
            onClick={() => onOpenPaywall("vip_plans")}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold transition-all"
          >
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Ver Cardápios Especiais VIP</span>
          </button>
        )}
      </div>

      {/* Plan Tabs - Grouped into Standard and VIP */}
      <div className="mt-6 space-y-4">
        {/* Standard Plans Grid */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Cardápios Essenciais (Inclusos)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIET_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20 shadow-xs"
                      : "border-stone-200 bg-stone-50/60 hover:bg-stone-100/70 text-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">{plan.title}</span>
                    <span className="text-[10px] font-bold text-stone-600 px-2 py-0.5 rounded-md bg-white border border-stone-200">
                      ~{plan.dailyCalories} kcal
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2">{plan.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* VIP Special Plans Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              Cardápios Especiais VIP (Aceleração Máxima)
            </span>
            <span className="text-[10px] font-bold text-amber-700">
              {premiumState.isVipMember ? "Acesso VIP Ativo" : "Conteúdo Pago"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIP_DIET_PLANS.map((plan) => {
              const isSelected = plan.id === selectedPlanId;
              const isUnlocked =
                premiumState.isVipMember || premiumState.unlockedPlans.includes(plan.id);

              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-2xl text-left border-2 transition-all relative overflow-hidden ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/30 shadow-xs"
                      : "border-amber-200 bg-gradient-to-br from-amber-50/30 to-stone-50 hover:border-amber-300 text-stone-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-sm">{plan.title}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-sm bg-amber-200 text-amber-950 uppercase">
                        {plan.badgeText || "VIP"}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {isUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3 text-emerald-600" /> Liberado
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {plan.price || "R$ 19,90"}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{plan.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Plan Overview Card */}
      <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
            Perfil Recomendado:
          </span>
          <div className="text-sm font-semibold text-stone-800">{activePlan.idealFor}</div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-center">
            <div className="text-blue-700 font-bold">{activePlan.macros.protein}g</div>
            <div className="text-[10px] text-stone-400">Proteínas</div>
          </div>
          <div className="text-center">
            <div className="text-amber-700 font-bold">{activePlan.macros.carbs}g</div>
            <div className="text-[10px] text-stone-400">Carboidratos</div>
          </div>
          <div className="text-center">
            <div className="text-rose-700 font-bold">{activePlan.macros.fat}g</div>
            <div className="text-[10px] text-stone-400">Gorduras</div>
          </div>
          <div className="text-center border-l pl-4 border-stone-300">
            <div className="text-stone-900 font-black">{activePlan.dailyCalories}</div>
            <div className="text-[10px] text-stone-400">Total Kcal</div>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {addedMealName && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Refeição "{addedMealName}" adicionada ao seu contador de hoje com sucesso!</span>
        </div>
      )}

      {/* If Active Plan is a Locked VIP Plan, Show Prominent Paywall Lock Overlay */}
      {!isPlanUnlocked ? (
        <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-stone-50 via-amber-50/40 to-stone-100 border-2 border-amber-300/80 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="max-w-lg mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950">
              Protocolo Exclusivo de Aceleração
            </span>
            <h3 className="text-xl font-black text-stone-900 pt-1">
              Desbloqueie o {activePlan.title}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Receitas milimetricamente calculadas para quebrar a adaptação metabólica, acelerar a termogênese e eliminar inchaço abdominal sem perder massa magra.
            </p>
          </div>

          {/* Locked Preview Cards Teaser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left opacity-75 blur-[0.6px] pointer-events-none select-none">
            {activePlan.meals.slice(0, 2).map((m, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-stone-200">
                <div className="text-[10px] uppercase font-bold text-amber-800">{m.type}</div>
                <div className="text-xs font-bold text-stone-800 truncate">{m.name}</div>
                <div className="text-[11px] text-stone-500 mt-1">{m.calories} kcal • {m.prepTime}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenPaywall("vip_plans")}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Crown className="w-4 h-4" />
              <span>Desbloquear Cardápios VIP ({activePlan.price || "R$ 19,90"})</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenPaywall("all_access")}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>evoluindo+ VIP Completo (R$ 47,00)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Meals in the Plan (Unlocked View) */
        <div className="mt-6 space-y-4">
          {activePlan.isVip && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Você tem acesso VIP completo a este cardápio especial! Aproveite as receitas e instruções.</span>
            </div>
          )}

          {activePlan.meals.map((meal, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-colors shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {meal.type}
                    </span>
                    <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {meal.prepTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">{meal.name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-stone-900">
                    {meal.calories} <span className="text-xs font-normal text-stone-400">kcal</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    P: {meal.protein}g • C: {meal.carbs}g • G: {meal.fat}g
                  </div>
                </div>
              </div>

              {/* Ingredients & steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="font-bold text-stone-700 mb-1">Ingredientes práticos:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    {meal.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="font-bold text-stone-700 mb-1">Preparo Express:</div>
                  <p className="text-stone-600 leading-relaxed">{meal.steps}</p>
                </div>
              </div>

              {/* Add to Diary Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleLogRecipe(meal)}
                  className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar no Meu Dia</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
