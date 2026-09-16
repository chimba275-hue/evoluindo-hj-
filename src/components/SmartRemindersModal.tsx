import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  Sparkles,
  Clock,
  Droplets,
  Scale,
  Volume2,
} from "lucide-react";
import { UserProfile } from "../types";
import { soundFx } from "../utils/sound";

interface SmartRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: UserProfile["reminders"];
  onUpdateReminders: (updated: UserProfile["reminders"]) => void;
  onTriggerTestToast: (text: string) => void;
}

export const SmartRemindersModal: React.FC<SmartRemindersModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onUpdateReminders,
  onTriggerTestToast,
}) => {
  const [localReminders, setLocalReminders] = useState(reminders);

  const toggle = (key: keyof UserProfile["reminders"]) => {
    const updated = { ...localReminders, [key]: !localReminders[key] };
    setLocalReminders(updated);
    onUpdateReminders(updated);
  };

  const handleTestAlert = (message: string) => {
    soundFx.playCountdownBeep(900, 0.15);
    onTriggerTestToast(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Lembretes Inteligentes</h3>
              <p className="text-xs text-stone-500">Alertas precisos para manter a rotina sem estresse</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reminders list */}
        <div className="space-y-3">
          {/* Fasting break */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Hora de Quebrar o Jejum</div>
                <div className="text-[11px] text-stone-500">Avisa quando a meta de horas for atingida</div>
              </div>
            </div>
            <button
              onClick={() => toggle("fastingBreak")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                localReminders.fastingBreak ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  localReminders.fastingBreak ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Fasting window close */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Fechamento da Janela</div>
                <div className="text-[11px] text-stone-500">Alerta 30 min antes de iniciar o jejum da noite</div>
              </div>
            </div>
            <button
              onClick={() => toggle("fastingWindowClose")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                localReminders.fastingWindowClose ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  localReminders.fastingWindowClose ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Water reminder */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Lembrete de Hidratação</div>
                <div className="text-[11px] text-stone-500">Sugestão de copo d'água a cada 2 horas de foco</div>
              </div>
            </div>
            <button
              onClick={() => toggle("waterReminder")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                localReminders.waterReminder ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  localReminders.waterReminder ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Weekly weigh in */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Check-in de Pesagem Semanal</div>
                <div className="text-[11px] text-stone-500">Toda segunda-feira de manhã em jejum</div>
              </div>
            </div>
            <button
              onClick={() => toggle("weeklyWeighIn")}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                localReminders.weeklyWeighIn ? "bg-emerald-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  localReminders.weeklyWeighIn ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Test live notification button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleTestAlert("🔔 Lembrete: Hora de quebrar seu jejum de 16h com refeição rica em proteínas!")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Testar Alerta Visual no App</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};
