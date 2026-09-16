import { FASTING_PHASES } from "../data/initialData";
import { FastingPhaseInfo, FastingProtocolType, UserProfile } from "../types";

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female"
): number {
  if (gender === "male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

export function calculateTDEE(
  bmr: number,
  activityLevel: "sedentary" | "light" | "moderate" | "very_active"
): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}

export function calculateCalorieTarget(
  tdee: number,
  bmr: number,
  gender: "male" | "female",
  pace: "moderate" | "firm" | "aggressive"
): number {
  const deficits = {
    moderate: 400, // ~0.4 - 0.5kg/semana
    firm: 600, // ~0.6 - 0.75kg/semana
    aggressive: 800, // ~0.8 - 1.0kg/semana
  };

  const minSafe = gender === "male" ? Math.max(1400, Math.round(bmr * 0.9)) : Math.max(1200, Math.round(bmr * 0.9));
  const target = tdee - (deficits[pace] || 500);
  return Math.max(minSafe, target);
}

export function calculateWaterTarget(weightKg: number): number {
  return Math.round(weightKg * 35);
}

export function calculateTargetDate(
  currentWeight: number,
  goalWeight: number,
  pace: "moderate" | "firm" | "aggressive"
): string {
  const diff = currentWeight - goalWeight;
  if (diff <= 0) return "Meta alcançada!";
  const weeklyLoss = pace === "moderate" ? 0.5 : pace === "firm" ? 0.75 : 1.0;
  const weeks = Math.ceil(diff / weeklyLoss);
  return `${weeks} ${weeks === 1 ? "semana" : "semanas"} (~${(weeks / 4.3).toFixed(1)} meses)`;
}

export function getFastingPhase(elapsedHours: number): FastingPhaseInfo {
  for (const phase of FASTING_PHASES) {
    if (elapsedHours >= phase.minHours && elapsedHours < phase.maxHours) {
      return phase;
    }
  }
  return FASTING_PHASES[FASTING_PHASES.length - 1];
}

export function formatTimeHoursMinutes(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatSimpleDuration(hours: number): string {
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  if (mins === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${mins}min`;
}
