import React, { useState, useEffect } from "react";
import {
  Timer,
  Flame,
  Camera,
  Bot,
  Utensils,
  Dumbbell,
  TrendingDown,
  Droplets,
  BookOpen,
  Bell,
  Settings,
  Sparkles,
  History,
  Calendar,
  AlertCircle,
  X,
  Zap,
  Crown,
  Trophy,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  DEFAULT_USER_PROFILE,
  INITIAL_FASTING_HISTORY,
  INITIAL_WEIGHT_LOGS,
} from "./data/initialData";
import {
  FastingHistoryItem,
  FastingProtocolType,
  FastingSession,
  MealItem,
  UserProfile,
  WaterEntry,
  WeightLog,
  PremiumAccessState,
} from "./types";
import { FastingTimerSection } from "./components/FastingTimerSection";
import { CalorieDeficitSection } from "./components/CalorieDeficitSection";
import { FoodPhotoAnalyzerModal } from "./components/FoodPhotoAnalyzerModal";
import { AiCoachChatModal } from "./components/AiCoachChatModal";
import { MealPlansSection } from "./components/MealPlansSection";
import { WorkoutsSection } from "./components/WorkoutsSection";
import { WeightLossCurveSection } from "./components/WeightLossCurveSection";
import { WaterTrackerSection } from "./components/WaterTrackerSection";
import { FastingHistoryModal } from "./components/FastingHistoryModal";
import { SmartRemindersModal } from "./components/SmartRemindersModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { ScienceEducationSection } from "./components/ScienceEducationSection";
import { Challenge30Section } from "./components/Challenge30Section";
import { CheckoutPaywallModal, OfferType } from "./components/CheckoutPaywallModal";
import { getFastingPhase } from "./utils/calculations";

export default function App() {
  // Navigation tabs
  type TabType = "timer" | "calories" | "plans" | "desafio" | "workouts" | "curve" | "water" | "science";
  const [currentTab, setCurrentTab] = useState<TabType>("timer");

  // Modals state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallInitialOffer, setPaywallInitialOffer] = useState<OfferType>("all_access");
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Persistent VIP and In-App purchases state
  const [premiumState, setPremiumState] = useState<PremiumAccessState>(() => {
    try {
      const saved = localStorage.getItem("evoluindo_premium_access");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse premium state", e);
    }
    return {
      isVipMember: false,
      unlockedPlans: [],
      unlockedChallenge30: false,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem("evoluindo_premium_access", JSON.stringify(premiumState));
    } catch (e) {
      console.warn("Failed to save premium state", e);
    }
  }, [premiumState]);

  const handleOpenPaywall = (offer: OfferType = "all_access") => {
    setPaywallInitialOffer(offer);
    setShowPaywallModal(true);
  };

  const handleUnlockSuccess = (offer: OfferType) => {
    setPremiumState((prev) => {
      if (offer === "all_access") {
        return {
          isVipMember: true,
          unlockedPlans: ["anti_inflammatory_vip", "plateau_breaker_vip"],
          unlockedChallenge30: true,
        };
      } else if (offer === "challenge_30") {
        return {
          ...prev,
          unlockedChallenge30: true,
        };
      } else if (offer === "vip_plans") {
        return {
          ...prev,
          unlockedPlans: Array.from(
            new Set([...(prev.unlockedPlans || []), "anti_inflammatory_vip", "plateau_breaker_vip"])
          ),
        };
      }
      return prev;
    });

    const offerTitles: Record<OfferType, string> = {
      all_access: "Acesso VIP Vitalício Ativado! Parabéns pela decisão!",
      challenge_30: "Desafio 30 Dias Liberado com Sucesso! Bons treinos!",
      vip_plans: "Cardápios Especiais VIP Desbloqueados com Sucesso!",
    };

    setActiveToast(offerTitles[offer]);
    setTimeout(() => setActiveToast(null), 5000);
  };

  const handleResetPurchases = () => {
    setPremiumState({
      isVipMember: false,
      unlockedPlans: [],
      unlockedChallenge30: false,
    });
    setActiveToast("Compras restauradas para modo gratuito de demonstração.");
    setTimeout(() => setActiveToast(null), 3000);
  };

  // Persistent user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("rotina_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return { ...DEFAULT_USER_PROFILE, ...parsed };
      }
    } catch (e) {
      console.warn("Failed to parse user profile from localStorage", e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // Fasting session
  const [fastingSession, setFastingSession] = useState<FastingSession>(() => {
    try {
      const saved = localStorage.getItem("rotina_fasting_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse fasting session", e);
    }

    // Initial default: 13.5 hours into a 16:8 fast
    const initialStart = new Date(Date.now() - 13.5 * 3600 * 1000).toISOString();
    return {
      isActive: true,
      protocol: "16:8",
      startTime: initialStart,
      targetHours: 16,
      elapsedSeconds: 13.5 * 3600,
    };
  });

  // Fasting history
  const [fastingHistory, setFastingHistory] = useState<FastingHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("rotina_fasting_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse fasting history", e);
    }
    return INITIAL_FASTING_HISTORY;
  });

  // Weight logs
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    try {
      const saved = localStorage.getItem("rotina_weight_logs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse weight logs", e);
    }
    return INITIAL_WEIGHT_LOGS;
  });

  // Today meals
  const [todayMeals, setTodayMeals] = useState<MealItem[]>(() => {
    try {
      const saved = localStorage.getItem("rotina_today_meals");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse meals", e);
    }

    return [
      {
        id: "m1",
        name: "Ovos Mexidos com Espinafre e Azeite",
        calories: 340,
        protein: 22,
        carbs: 4,
        fat: 26,
        fiber: 2,
        time: "12:15",
        source: "manual",
      },
      {
        id: "m2",
        name: "Iogurte Natural com Sementes de Chia e Canela",
        calories: 190,
        protein: 15,
        carbs: 9,
        fat: 10,
        fiber: 4,
        time: "15:40",
        source: "cardapio",
      },
    ];
  });

  // Water tracking
  const [waterTodayMl, setWaterTodayMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("rotina_water_today");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse water", e);
    }
    return 1200;
  });

  const [waterLogs, setWaterLogs] = useState<WaterEntry[]>(() => {
    try {
      const saved = localStorage.getItem("rotina_water_logs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse water logs", e);
    }
    return [
      { id: "w1", amountMl: 500, timestamp: "08:30" },
      { id: "w2", amountMl: 350, timestamp: "11:15" },
      { id: "w3", amountMl: 350, timestamp: "14:00" },
    ];
  });

  // Streak
  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("rotina_streak");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse streak", e);
    }
    return 6;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("rotina_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("rotina_fasting_session", JSON.stringify(fastingSession));
  }, [fastingSession]);

  useEffect(() => {
    localStorage.setItem("rotina_fasting_history", JSON.stringify(fastingHistory));
  }, [fastingHistory]);

  useEffect(() => {
    localStorage.setItem("rotina_weight_logs", JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem("rotina_today_meals", JSON.stringify(todayMeals));
  }, [todayMeals]);

  useEffect(() => {
    localStorage.setItem("rotina_water_today", waterTodayMl.toString());
  }, [waterTodayMl]);

  useEffect(() => {
    localStorage.setItem("rotina_water_logs", JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem("rotina_streak", streak.toString());
  }, [streak]);

  // Fasting Handlers
  const handleStartFasting = (protocol: FastingProtocolType, customStartOffsetHours?: number) => {
    const targets: Record<FastingProtocolType, number> = {
      "16:8": 16,
      "18:6": 18,
      "20:4": 20,
      OMAD: 23,
    };
    const offsetMs = (customStartOffsetHours || 0) * 3600 * 1000;
    const startTime = new Date(Date.now() - offsetMs).toISOString();
    setFastingSession({
      isActive: true,
      protocol,
      startTime,
      targetHours: targets[protocol] || 16,
      elapsedSeconds: (customStartOffsetHours || 0) * 3600,
    });
  };

  const handleEndFasting = (actualHours?: number, completed?: boolean) => {
    if (!fastingSession.startTime) return;
    const elapsedHours = actualHours ?? Number(
      ((Date.now() - new Date(fastingSession.startTime).getTime()) / 3600000).toFixed(1)
    );
    const wasCompleted = completed ?? (elapsedHours >= fastingSession.targetHours);

    const newHistoryItem: FastingHistoryItem = {
      id: Date.now().toString(),
      protocol: fastingSession.protocol,
      startTime: fastingSession.startTime,
      endTime: new Date().toISOString(),
      targetHours: fastingSession.targetHours,
      actualHours: elapsedHours,
      completed: wasCompleted,
      date: new Date().toISOString().split("T")[0],
    };

    setFastingHistory((prev) => [newHistoryItem, ...(Array.isArray(prev) ? prev : [])]);

    if (wasCompleted) {
      setStreak((s) => s + 1);
    }

    setFastingSession({
      isActive: false,
      protocol: fastingSession.protocol,
      startTime: null,
      targetHours: fastingSession.targetHours,
      elapsedSeconds: 0,
    });

    triggerToast(
      wasCompleted
        ? `🎉 Jejum de ${elapsedHours}h concluído com sucesso! Streak aumentado.`
        : `Jejum finalizado (${elapsedHours}h registradas no histórico).`
    );
  };

  const handleUpdateProtocol = (protocol: FastingProtocolType) => {
    const targets: Record<FastingProtocolType, number> = {
      "16:8": 16,
      "18:6": 18,
      "20:4": 20,
      OMAD: 23,
    };
    setFastingSession((prev) => ({
      ...prev,
      protocol,
      targetHours: targets[protocol],
    }));
  };

  // Meal Handlers
  const handleAddMeal = (meal: Omit<MealItem, "id" | "time">) => {
    const newMealItem: MealItem = {
      ...meal,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setTodayMeals((prev) => [newMealItem, ...prev]);
    triggerToast(`Prato "${meal.name}" (${meal.calories} kcal) adicionado ao diário!`);
  };

  const handleDeleteMeal = (id: string) => {
    setTodayMeals((prev) => prev.filter((m) => m.id !== id));
  };

  // Water Handlers
  const handleAddWater = (amount: number) => {
    setWaterTodayMl((w) => w + amount);
    const newEntry: WaterEntry = {
      id: Date.now().toString(),
      amountMl: amount,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setWaterLogs((prev) => [newEntry, ...prev]);
  };

  const handleResetWater = () => {
    setWaterTodayMl(0);
    setWaterLogs([]);
  };

  const handleDeleteWaterLog = (id: string) => {
    const entry = waterLogs.find((w) => w.id === id);
    if (entry) {
      setWaterTodayMl((w) => Math.max(0, w - entry.amountMl));
      setWaterLogs((prev) => prev.filter((w) => w.id !== id));
    }
  };

  // Weight Handlers
  const handleAddWeightLog = (weight: number, date: string, note?: string) => {
    const newLog: WeightLog = {
      id: Date.now().toString(),
      date,
      weight,
      note,
    };
    setWeightLogs((prev) => [...prev, newLog]);
    setUserProfile((prev) => ({
      ...prev,
      currentWeight: weight,
    }));
    triggerToast(`Pesagem registrada: ${weight} kg.`);
  };

  const handleUpdateGoalSettings = (
    newGoal: number,
    newPace: "moderate" | "firm" | "aggressive"
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      goalWeight: newGoal,
      lossPace: newPace,
    }));
    triggerToast(`Meta atualizada para ${newGoal} kg.`);
  };

  const triggerToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Header quick calculations
  const safeTodayMeals = Array.isArray(todayMeals) ? todayMeals : [];
  const totalCaloriesConsumed = safeTodayMeals.reduce((acc, m) => acc + (m?.calories || 0), 0);
  const remainingCalories = (userProfile?.dailyCalorieTarget || 1600) - totalCaloriesConsumed;
  const elapsedHours = fastingSession.isActive && fastingSession.startTime
    ? (Date.now() - new Date(fastingSession.startTime).getTime()) / 3600000
    : 0;
  const currentPhase = getFastingPhase(elapsedHours);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20 sm:pb-12">
      {/* Live Toast Notification */}
      {activeToast && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activeToast}</span>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky App Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900">
                    evoluindo<span className="text-emerald-600">hj</span>
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Sem Dieta Rigorosa
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Jejum • IA de Pratos • Déficit TDEE • Coach • Treinos Curtos
                </p>
              </div>
            </div>

            {/* Quick Metrics Glance */}
            <div className="hidden lg:flex items-center gap-3 text-xs">
              {/* Fasting Glance */}
              <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-stone-700">
                  {fastingSession.isActive ? `${elapsedHours.toFixed(1)}h (${currentPhase.name.split(" ")[0]})` : "Janela Aberta"}
                </span>
              </div>

              {/* Calories Glance */}
              <div className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-semibold text-stone-700">
                  {remainingCalories >= 0 ? `${remainingCalories} kcal restantes` : `${Math.abs(remainingCalories)} kcal acima`}
                </span>
              </div>

              {/* Streak */}
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-1 text-orange-800 hover:bg-orange-100 transition-colors"
                title="Ver Histórico e Streaks"
              >
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span className="font-bold">{streak} dias</span>
              </button>
            </div>

            {/* Quick Action Utility Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* AI Food Photo Camera Button */}
              <button
                id="btn-open-photo-camera"
                onClick={() => setShowPhotoModal(true)}
                className="py-2 px-3 sm:px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Foto do Prato (IA)</span>
                <span className="sm:hidden">Foto</span>
              </button>

              {/* AI Coach Button */}
              <button
                id="btn-open-coach-chat"
                onClick={() => setShowCoachModal(true)}
                className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                title="Coach IA"
              >
                <Bot className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Coach IA</span>
              </button>

              {/* VIP Club Button */}
              <button
                id="btn-open-vip-paywall"
                onClick={() => handleOpenPaywall("all_access")}
                className={`py-2 px-3 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs ${
                  premiumState.isVipMember
                    ? "bg-amber-100 border border-amber-300 text-amber-950 hover:bg-amber-200"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 shadow-xs active:scale-95"
                }`}
                title="Clube VIP evoluindo+"
              >
                <Crown className="w-3.5 h-3.5 text-amber-900 fill-amber-500" />
                <span className="hidden sm:inline">{premiumState.isVipMember ? "Membro VIP" : "Assinar VIP"}</span>
                <span className="sm:hidden">VIP</span>
              </button>

              {/* Reminders Button */}
              <button
                onClick={() => setShowRemindersModal(true)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                title="Lembretes Inteligentes"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Fasting History */}
              <button
                onClick={() => setShowHistoryModal(true)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                title="Histórico de Jejuns"
              >
                <History className="w-4 h-4" />
              </button>

              {/* Onboarding & Settings */}
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
                title="Metas & Perfil (Setup TDEE)"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="border-t border-stone-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 text-xs font-semibold">
              <button
                onClick={() => setCurrentTab("timer")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "timer"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Timer Jejum</span>
              </button>

              <button
                onClick={() => setCurrentTab("calories")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "calories"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Déficit & Calorias</span>
              </button>

              <button
                onClick={() => setCurrentTab("plans")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "plans"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Cardápios Express</span>
              </button>

              {/* 30-Day Body Challenge Tab (Paid/VIP) */}
              <button
                id="tab-desafio-30"
                onClick={() => setCurrentTab("desafio")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "desafio"
                    ? "bg-amber-500 text-stone-950 font-black shadow-2xs"
                    : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                }`}
              >
                <Trophy className={`w-3.5 h-3.5 ${currentTab === "desafio" ? "text-stone-950" : "text-amber-500"}`} />
                <span>Desafio 30 Dias</span>
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm ${
                  currentTab === "desafio"
                    ? "bg-stone-950 text-amber-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}>
                  VIP
                </span>
              </button>

              <button
                onClick={() => setCurrentTab("workouts")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "workouts"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Treinos Curtos (HIIT)</span>
              </button>

              <button
                onClick={() => setCurrentTab("curve")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "curve"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Curva de Peso</span>
              </button>

              <button
                onClick={() => setCurrentTab("water")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "water"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Tracker de Água</span>
              </button>

              <button
                onClick={() => setCurrentTab("science")}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  currentTab === "science"
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Ciência Sem Achismo</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === "timer" && (
          <FastingTimerSection
            session={fastingSession}
            streak={streak}
            bestStreak={Math.max(streak, 14)}
            onStartFast={handleStartFasting}
            onEndFast={handleEndFasting}
            onOpenHistory={() => setShowHistoryModal(true)}
          />
        )}

        {currentTab === "calories" && (
          <CalorieDeficitSection
            userProfile={userProfile}
            meals={safeTodayMeals}
            onOpenPhotoAI={() => setShowPhotoModal(true)}
            onAddManualMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {currentTab === "plans" && (
          <MealPlansSection
            onAddMealToDiary={handleAddMeal}
            premiumState={premiumState}
            onOpenPaywall={(offer) => handleOpenPaywall(offer || "vip_plans")}
          />
        )}

        {currentTab === "desafio" && (
          <Challenge30Section
            premiumState={premiumState}
            onOpenPaywall={(offer) => handleOpenPaywall(offer || "challenge_30")}
            onSelectWorkoutTab={() => setCurrentTab("workouts")}
            onSelectTimerTab={() => setCurrentTab("timer")}
          />
        )}

        {currentTab === "workouts" && (
          <WorkoutsSection
            onOpenChallengeTab={() => setCurrentTab("desafio")}
            onOpenPaywall={() => handleOpenPaywall("all_access")}
            premiumState={premiumState}
          />
        )}

        {currentTab === "curve" && (
          <WeightLossCurveSection
            userProfile={userProfile}
            weightLogs={weightLogs}
            onAddWeightLog={handleAddWeightLog}
            onUpdateGoalSettings={handleUpdateGoalSettings}
          />
        )}

        {currentTab === "water" && (
          <WaterTrackerSection
            currentWaterMl={waterTodayMl}
            targetWaterMl={userProfile.dailyWaterTargetMl}
            waterLogs={waterLogs}
            onAddWater={handleAddWater}
            onResetWater={handleResetWater}
            onDeleteLog={handleDeleteWaterLog}
          />
        )}

        {currentTab === "science" && <ScienceEducationSection />}
      </main>

      {/* Floating AI Coach Button (Convenient for busy users anytime) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setShowCoachModal(true)}
          className="group px-4 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-xl border border-stone-700 transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span>Coach IA Express</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Modals */}
      <FoodPhotoAnalyzerModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onMealAdded={handleAddMeal}
      />

      <AiCoachChatModal
        isOpen={showCoachModal}
        onClose={() => setShowCoachModal(false)}
        userProfile={userProfile}
        fastingSession={fastingSession}
        caloriesToday={totalCaloriesConsumed}
        waterToday={waterTodayMl}
        streak={streak}
      />

      <FastingHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={fastingHistory}
        currentStreak={streak}
        bestStreak={Math.max(streak, 14)}
      />

      <SmartRemindersModal
        isOpen={showRemindersModal}
        onClose={() => setShowRemindersModal(false)}
        reminders={userProfile.reminders}
        onUpdateReminders={(reminders) =>
          setUserProfile((prev) => ({ ...prev, reminders }))
        }
        onTriggerTestToast={triggerToast}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        currentProfile={userProfile}
        onSaveProfile={(profile) => {
          setUserProfile(profile);
          triggerToast("Perfil atualizado! TDEE e metas recalculados.");
        }}
      />

      {/* VIP Checkout & In-App Purchase Paywall Modal */}
      <CheckoutPaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        initialOffer={paywallInitialOffer}
        premiumState={premiumState}
        onUnlockSuccess={handleUnlockSuccess}
        onResetPurchases={handleResetPurchases}
      />
    </div>
  );
}
