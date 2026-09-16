import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Utensils,
} from "lucide-react";
import { MealItem } from "../types";

interface FoodPhotoAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMealAdded: (meal: Omit<MealItem, "id" | "time">) => void;
}

interface AnalysisResult {
  foodName: string;
  items: { name: string; portion?: string; calories: number }[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  healthScore: number;
  verdict: string;
  busyTip: string;
}

export const FoodPhotoAnalyzerModal: React.FC<FoodPhotoAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onMealAdded,
}) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Sample plates for instant testing if user has no photo
  const samplePlates = [
    {
      name: "Frango Grelhado, Brócolis e Arroz",
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Ovos Mexidos com Abacate e Tomate",
      url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Salmão com Vegetais no Vapor",
      url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Start / Stop camera stream
  useEffect(() => {
    if (isOpen && activeTab === "camera" && !imagePreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, imagePreview]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Câmera não suportada neste navegador. Use a opção de upload.");
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      setCameraError("Não foi possível acessar a câmera. Você pode enviar uma foto do arquivo ou usar um prato de exemplo.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = async (url: string) => {
    try {
      setIsLoading(true);
      // Fetch image and convert to base64
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setIsLoading(false);
      setImagePreview(url);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imagePreview,
          notes: userNotes,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Falha ao analisar a foto.");
      }

      setAnalysisResult(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || "Erro de conexão ao analisar imagem com IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMealToLog = () => {
    if (!analysisResult) return;
    onMealAdded({
      name: analysisResult.foodName,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      fiber: analysisResult.fiber,
      source: "photo_ai",
      imageUrl: imagePreview || undefined,
    });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setUserNotes("");
    if (activeTab === "camera") {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Foto do Prato → Calorias por IA
              </h3>
              <p className="text-xs text-stone-500">Estimativa automática de macros e calorias em segundos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode: If no analysis result yet */}
        {!analysisResult ? (
          <div className="space-y-4">
            {/* Tabs */}
            {!imagePreview && (
              <div className="flex border border-stone-200 p-1 rounded-xl bg-stone-50">
                <button
                  type="button"
                  onClick={() => setActiveTab("camera")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === "camera"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Câmera ao Vivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === "upload"
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Enviar Arquivo</span>
                </button>
              </div>
            )}

            {/* Media Area */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 min-h-[240px] flex items-center justify-center border border-stone-200">
              {imagePreview ? (
                <div className="relative w-full h-64 bg-stone-950">
                  <img
                    src={imagePreview}
                    alt="Foto do prato capturada"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full transition-colors"
                    title="Tirar outra foto"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              ) : activeTab === "camera" ? (
                <div className="relative w-full h-64 flex flex-col items-center justify-center">
                  {cameraError ? (
                    <div className="p-4 text-center text-white space-y-2 max-w-xs">
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-xs text-stone-300">{cameraError}</p>
                      <button
                        onClick={() => setActiveTab("upload")}
                        className="text-xs font-bold text-emerald-400 underline"
                      >
                        Carregar imagem da galeria
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={captureCameraSnapshot}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Fotografar Prato</span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-white space-y-3">
                  <Upload className="w-10 h-10 text-stone-400 mx-auto" />
                  <div className="text-sm font-semibold text-stone-200">
                    Selecione uma foto da sua refeição
                  </div>
                  <label className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    Escolher da Galeria / Arquivos
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Quick Sample Plates (Great for testing) */}
            {!imagePreview && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Ou teste com um prato rápido de exemplo:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {samplePlates.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSampleSelect(sample.url)}
                      className="p-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 text-left text-[11px] font-medium text-stone-700 bg-stone-50 line-clamp-1 transition-colors flex items-center gap-1.5"
                    >
                      <Utensils className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* User notes (optional) */}
            {imagePreview && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Algum detalhe extra? (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: sem óleo, 1 filé médio de frango, queijo minas..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Analyze trigger button */}
            {imagePreview && (
              <button
                id="btn-confirm-analyze"
                onClick={analyzeImage}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A IA do Gemini está analisando seu prato...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calcular Calorias e Macros com IA</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          /* Result View */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800">
                    Identificado por IA
                  </span>
                  <h4 className="text-base font-bold text-stone-900 mt-1">
                    {analysisResult.foodName}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-stone-900">
                    {analysisResult.calories}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 uppercase">kcal totais</div>
                </div>
              </div>

              {/* Macros 4-column */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60 text-center">
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-semibold text-blue-700">Proteína</div>
                  <div className="text-sm font-bold text-stone-900">{analysisResult.protein}g</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-semibold text-amber-700">Carbos</div>
                  <div className="text-sm font-bold text-stone-900">{analysisResult.carbs}g</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-semibold text-rose-700">Gordura</div>
                  <div className="text-sm font-bold text-stone-900">{analysisResult.fat}g</div>
                </div>
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-semibold text-emerald-700">Fibras</div>
                  <div className="text-sm font-bold text-stone-900">{analysisResult.fiber || 0}g</div>
                </div>
              </div>
            </div>

            {/* Identified ingredients */}
            {analysisResult.items && analysisResult.items.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 block">Itens reconhecidos:</span>
                <div className="space-y-1">
                  {analysisResult.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50 border border-stone-100 text-stone-700"
                    >
                      <span>{item.name} {item.portion ? `(${item.portion})` : ""}</span>
                      <span className="font-semibold">{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Busy person tip from AI */}
            {analysisResult.busyTip && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dica Express para sua Rotina:</span>
                </div>
                <p className="leading-relaxed text-stone-600">{analysisResult.busyTip}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Analisar Outro Prato
              </button>
              <button
                id="btn-add-food-to-diary"
                type="button"
                onClick={handleAddMealToLog}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Adicionar ao Diário</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
