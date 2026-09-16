import React, { useState } from "react";
import {
  X,
  Crown,
  CheckCircle2,
  Lock,
  QrCode,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
  Flame,
  Star,
  Award,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { PremiumAccessState } from "../types";

export type OfferType = "all_access" | "challenge_30" | "vip_plans";

interface CheckoutPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOffer?: OfferType;
  premiumState: PremiumAccessState;
  onUnlockSuccess: (offer: OfferType) => void;
  onResetPurchases?: () => void;
}

export const CheckoutPaywallModal: React.FC<CheckoutPaywallModalProps> = ({
  isOpen,
  onClose,
  initialOffer = "all_access",
  premiumState,
  onUnlockSuccess,
  onResetPurchases,
}) => {
  const [selectedOffer, setSelectedOffer] = useState<OfferType>(initialOffer);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [installments, setInstallments] = useState("1");

  // Card form state
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  if (!isOpen) return null;

  const OFFERS = {
    all_access: {
      id: "all_access",
      title: "evoluindo+ VIP Total",
      badge: "⭐ Mais Popular & Completo",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      price: "R$ 47,00",
      originalPrice: "R$ 97,00",
      period: "Acesso Vitalício Único",
      description: "Liberação total de todos os recursos pagos e lançamentos futuros.",
      features: [
        "Desafio Completo 30 Dias: Corpo Definido (30 dias de missões & treinos)",
        "Cardápio Anti-Inflamatório Seca-Barriga VIP completo",
        "Cardápio Quebra de Platô Metabólico (Carb-Cycling VIP)",
        "Análise ilimitada de fotos de pratos com IA de alta precisão",
        "Acesso prioritário ao Coach IA de Rotina 24/7",
        "Garantia incondicional de 7 dias com reembolso total",
      ],
    },
    challenge_30: {
      id: "challenge_30",
      title: "Desafio 30 Dias: Corpo Definido",
      badge: "🏆 30 Dias de Transformação",
      badgeColor: "bg-orange-100 text-orange-900 border-orange-300",
      price: "R$ 29,90",
      originalPrice: "R$ 59,90",
      period: "Pagamento Único",
      description: "Cronograma diário de 30 dias com treinos adaptativos, fases de jejum e missões.",
      features: [
        "Acesso aos 30 dias de treinos progressivos (HIIT, Tabata & EMOM)",
        "Protocolos de jejum diários (14h até OMAD 20h)",
        "Checklist de hábitos diários com pontuação e streak",
        "Troféu e certificado de conclusão oficial do desafio",
        "Garantia de 7 dias",
      ],
    },
    vip_plans: {
      id: "vip_plans",
      title: "Pacote Cardápios Especiais VIP",
      badge: "🥗 Nutrição & Anti-Inchaço",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      price: "R$ 19,90",
      originalPrice: "R$ 39,90",
      period: "Pagamento Único",
      description: "Receitas exclusivas para acelerar a queima de gordura e desinflamar o abdômen.",
      features: [
        "Cardápio Anti-Inflamatório Seca-Barriga VIP (Receitas < 15 min)",
        "Cardápio Quebra de Platô Metabólico VIP (Carb-Cycling)",
        "Shots termogênicos matinais e bebidas aceleradoras",
        "Possibilidade de adicionar refeições VIP com 1 clique no diário",
        "Garantia de 7 dias",
      ],
    },
  };

  const currentOffer = OFFERS[selectedOffer];

  const pixKey = "00020126580014br.gov.bcb.pix0136evoluindo-vip-pagamento-40022464520400005303986540547.005802BR5915EVOLUINDOHJ6009SAOPAULO62070503***6304E8F2";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUnlockSuccess(selectedOffer);
      onClose();
    }, 1200);
  };

  const isCurrentOfferUnlocked =
    premiumState.isVipMember ||
    (selectedOffer === "challenge_30" && premiumState.unlockedChallenge30) ||
    (selectedOffer === "vip_plans" && premiumState.unlockedPlans.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Banner Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Clube Exclusivo evoluindo+ VIP
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Desbloqueie Resultados Acelerados
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg">
            Acesso a protocolos avançados de queima de gordura, cardápios termogênicos anti-inchaço e o Desafio 30 Dias.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Offer Selection Cards */}
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-2 uppercase tracking-wider">
              Escolha seu Pacote de Acesso:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(OFFERS) as OfferType[]).map((key) => {
                const offer = OFFERS[key];
                const isSelected = selectedOffer === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedOffer(key)}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 bg-stone-50/50"
                    }`}
                  >
                    {key === "all_access" && (
                      <span className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        Melhor Valor
                      </span>
                    )}
                    <div>
                      <div className="text-xs font-bold text-stone-900 leading-tight">
                        {offer.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-through mt-1">
                        {offer.originalPrice}
                      </div>
                      <div className="text-lg font-black text-stone-900">
                        {offer.price}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 mt-2 block">
                      {offer.period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offer Details Box */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${currentOffer.badgeColor}`}>
                {currentOffer.badge}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Liberação instantânea
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {currentOffer.description}
            </p>
            <div className="space-y-1.5 pt-1">
              {currentOffer.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-stone-600 block mb-2 uppercase tracking-wider">
              Forma de Pagamento Segura:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  paymentMethod === "pix"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>PIX (Instantâneo)</span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded-full font-extrabold">
                  Recomendado
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  paymentMethod === "card"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <CreditCard className="w-4 h-4 text-stone-700" />
                <span>Cartão de Crédito</span>
              </button>
            </div>
          </div>

          {/* Payment Form View */}
          {paymentMethod === "pix" ? (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      PIX com Confirmação Automática
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Válido por 15 minutos • Liberação imediata
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-500 block">Total a Pagar</span>
                  <span className="text-base font-black text-emerald-700">{currentOffer.price}</span>
                </div>
              </div>

              {/* Visual Simulated QR Code Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-emerald-100">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-900 p-2 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  {/* Stylized QR Code SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <rect x="5" y="5" width="30" height="30" fill="none" stroke="white" strokeWidth="6" />
                    <rect x="13" y="13" width="14" height="14" />
                    <rect x="65" y="5" width="30" height="30" fill="none" stroke="white" strokeWidth="6" />
                    <rect x="73" y="13" width="14" height="14" />
                    <rect x="5" y="65" width="30" height="30" fill="none" stroke="white" strokeWidth="6" />
                    <rect x="13" y="73" width="14" height="14" />
                    <rect x="45" y="10" width="10" height="15" />
                    <rect x="45" y="35" width="20" height="10" />
                    <rect x="10" y="45" width="15" height="10" />
                    <rect x="45" y="60" width="10" height="30" />
                    <rect x="65" y="45" width="25" height="10" />
                    <rect x="70" y="65" width="20" height="25" />
                  </svg>
                </div>
                <div className="flex-1 w-full space-y-2">
                  <p className="text-[11px] text-stone-600">
                    Abra o app do seu banco, escolha <strong>Pagar com PIX</strong> e aponte a câmera ou use o código Copia e Cola:
                  </p>
                  <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-lg border border-stone-200">
                    <input
                      type="text"
                      readOnly
                      value={pixKey}
                      className="text-[11px] font-mono text-stone-600 bg-transparent flex-1 outline-hidden truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-2.5 py-1 rounded-md bg-stone-900 text-white hover:bg-stone-800 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* PIX Action Confirmation Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando pagamento junto ao banco...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Já realizei o PIX • Liberar Acesso Imediato</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-800">Dados do Cartão de Crédito</span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  SSL 256-bit Seguro
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Nome Completo do Titular
                  </label>
                  <input
                    type="text"
                    placeholder="Como impresso no cartão"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Validade (MM/AA)
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                      CVV (Código de Segurança)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Parcelamento
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="1">1x de {currentOffer.price} (Sem juros)</option>
                    <option value="2">2x de R$ {(parseFloat(currentOffer.price.replace("R$ ", "").replace(",", ".")) / 2).toFixed(2).replace(".", ",")} sem juros</option>
                    <option value="3">3x de R$ {(parseFloat(currentOffer.price.replace("R$ ", "").replace(",", ".")) / 3).toFixed(2).replace(".", ",")} sem juros</option>
                  </select>
                </div>
              </div>

              {/* Card Action Confirmation Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processando cartão...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirmar Pagamento de {currentOffer.price}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Guarantees and Security Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-center">
            <div className="p-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-stone-800">Garantia 7 Dias</div>
              <div className="text-[9px] text-stone-500">100% do valor de volta</div>
            </div>
            <div className="p-2">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-stone-800">Acesso Instantâneo</div>
              <div className="text-[9px] text-stone-500">Liberado no aplicativo</div>
            </div>
            <div className="p-2">
              <Lock className="w-4 h-4 text-stone-700 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-stone-800">Dados Criptografados</div>
              <div className="text-[9px] text-stone-500">Ambiente 100% protegido</div>
            </div>
          </div>

          {/* Testing / Demonstration Controls (For Easy Review) */}
          <div className="p-3 bg-stone-100 rounded-xl border border-dashed border-stone-300 flex items-center justify-between text-xs">
            <div className="text-[11px] text-stone-600 font-medium">
              💡 <strong>Modo Avaliação / Teste Rápido:</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onUnlockSuccess("all_access");
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                title="Desbloquear tudo imediatamente para testar todas as telas"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                Desbloquear Tudo (Demo)
              </button>

              {onResetPurchases && (
                <button
                  type="button"
                  onClick={onResetPurchases}
                  className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-[10px] transition-colors"
                  title="Bloquear novamente para testar a experiência de um usuário gratuito"
                >
                  Bloquear / Resetar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
