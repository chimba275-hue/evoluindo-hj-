export type FastingProtocolType = "16:8" | "18:6" | "20:4" | "OMAD";

export interface UserProfile {
  name: string;
  gender: "male" | "female";
  age: number;
  heightCm: number;
  currentWeight: number;
  initialWeight: number;
  goalWeight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "very_active";
  preferredProtocol: FastingProtocolType;
  lossPace: "moderate" | "firm" | "aggressive"; // -0.5kg, -0.75kg, -1kg / semana
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  dailyWaterTargetMl: number;
  targetDateEstimate: string;
  onboarded: boolean;
  reminders: {
    fastingBreak: boolean;
    fastingWindowClose: boolean;
    waterReminder: boolean;
    weeklyWeighIn: boolean;
  };
}

export interface FastingSession {
  isActive: boolean;
  protocol: FastingProtocolType;
  targetHours: number;
  startTime: string | null; // ISO string
  plannedEndTime?: string; // ISO string
  actualEndTime?: string;
  isCustom?: boolean;
  elapsedSeconds?: number;
}

export interface FastingHistoryItem {
  id: string;
  date: string;
  protocol: FastingProtocolType;
  targetHours: number;
  actualHours: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  streakCountAtTime?: number;
}

export interface MealItem {
  id: string;
  name: string;
  portion?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  time: string;
  source: "photo_ai" | "manual" | "cardapio";
  imageUrl?: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface WaterEntry {
  id: string;
  timestamp: string;
  amountMl: number;
}

export interface WorkoutExercise {
  name: string;
  workSeconds: number;
  restSeconds: number;
  instruction: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  tag: "Tabata" | "HIIT" | "EMOM" | "Express";
  durationMin: number;
  level: "Iniciante" | "Intermediário" | "Avançado";
  caloriesBurn: number;
  description: string;
  rounds: number;
  exercises: WorkoutExercise[];
}

export interface RecipeMeal {
  name: string;
  type: "Quebra do Jejum" | "Refeição Principal" | "Lanche Rápido" | "Jantar Leve";
  prepTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string;
}

export interface DietPlan {
  id: string;
  title: string;
  subtitle: string;
  idealFor: string;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  meals: RecipeMeal[];
  isVip?: boolean;
  price?: string;
  badgeText?: string;
}

export interface PremiumAccessState {
  isVipMember: boolean; // all-access
  unlockedPlans: string[]; // specific plans
  unlockedChallenge30: boolean; // 30-day challenge
  planExpiryDate?: string;
}

export interface ChallengeTask {
  id: string;
  title: string;
  category: "treino" | "jejum" | "nutricao" | "habito";
  description: string;
  completed: boolean;
}

export interface ChallengeDay {
  dayNumber: number;
  phase: string;
  title: string;
  tag: string;
  focus: string;
  fastingTarget: string;
  workoutTitle: string;
  workoutDurationMin: number;
  workoutType: "HIIT" | "Tabata" | "EMOM" | "Descanso Ativo" | "Cardio Leve";
  tipOfTheDay: string;
  tasks: ChallengeTask[];
}

export interface FastingPhaseInfo {
  name: string;
  minHours: number;
  maxHours: number;
  color: string;
  badgeBg: string;
  icon: string;
  summary: string;
  metabolicEffect: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
