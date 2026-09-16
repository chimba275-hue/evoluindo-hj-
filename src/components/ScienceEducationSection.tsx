import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
} from "lucide-react";
import { SCIENTIFIC_TOPICS } from "../data/initialData";

export const ScienceEducationSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>("fases-jejum");

  const categories = [
    { id: "all", label: "Todos os Temas" },
    { id: "Fisiologia", label: "Fisiologia do Jejum" },
    { id: "Prática Express", label: "O que Quebra Jejum" },
    { id: "Digestão", label: "Refeed Inteligente" },
    { id: "Estratégia", label: "Como Destravar Platô" },
    { id: "Ciência", label: "Adaptação Metabólica" },
  ];

  const filteredTopics = SCIENTIFIC_TOPICS.filter((topic) => {
    if (selectedCategory === "all") return true;
    return topic.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-stone-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Educação Científica (Sem Achismo)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Base Médica & Bioquímica
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Entenda o que acontece em nível celular no seu corpo durante o jejum e como evitar o efeito sanfona.
          </p>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto mt-6 pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="mt-6 space-y-4">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedCardId === topic.id;
          return (
            <div
              key={topic.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-stone-50/80 transition-colors"
            >
              <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => toggleExpand(topic.id)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                      {topic.category}
                    </span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {topic.readTime}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {topic.summary}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-lg shrink-0 mt-1"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Bullet Key Points */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Pontos-chave para sua rotina:
                </span>
                <div className="space-y-1.5">
                  {topic.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed scientific explanation when expanded */}
              {isExpanded && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-stone-200 text-xs leading-relaxed text-stone-700 space-y-2 animate-fade-in">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Mecanismo Bioquímico Detalhado:</span>
                  </div>
                  <p>{topic.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
