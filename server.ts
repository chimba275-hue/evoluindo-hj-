import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "25mb" }));

// Server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Food photo analysis via Gemini Vision
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", notes = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Imagem não fornecida." });
    }

    const ai = getGeminiClient();

    // Clean base64 data if it has data url prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const prompt = `Você é um nutricionista esportivo de elite especializado em praticantes de jejum intermitente e rotinas corridas.
Analise detalhadamente a foto deste prato/refeição.
${notes ? `Observações do usuário sobre os alimentos: "${notes}"` : ""}

Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown de código, sem texto extra antes ou depois) com o seguinte formato exato:
{
  "foodName": "Nome descritivo e apetitoso do prato ou refeição",
  "items": [
    { "name": "Item ou ingrediente identificado", "portion": "porção estimada ex: 150g", "calories": 180 }
  ],
  "calories": 480,
  "protein": 35,
  "carbs": 25,
  "fat": 18,
  "fiber": 6,
  "healthScore": 9,
  "verdict": "Excelente para quebra de jejum / refeição principal",
  "busyTip": "Dica rápida de 1 ou 2 frases para quem tem pouco tempo e quer manter o déficit ou saciedade."
}
Valores numéricos de calories, protein, carbs, fat, fiber devem ser números inteiros (gramas/kcal).
Se a imagem não for de comida, retorne foodName: "Alimento não identificado" com calories 0 e veredicto explicativo.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction:
          "Você é um nutricionista digital analista de calorias e macros por fotos de pratos.",
      },
    });

    const responseText = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch {
      // Fallback regex extract
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Falha ao estruturar resposta da IA");
      }
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Erro na análise de comida:", error);
    return res.status(500).json({
      error: error?.message || "Não foi possível analisar a refeição no momento.",
    });
  }
});

// 3. AI Weight Loss Coach Chat with context
app.post("/api/coach-chat", async (req, res) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia." });
    }

    const ai = getGeminiClient();

    const {
      currentWeight,
      goalWeight,
      initialWeight,
      currentFastingHours,
      fastingProtocol,
      fastingPhase,
      isFasting,
      caloriesToday,
      calorieGoal,
      waterToday,
      waterGoal,
      streakDays,
      activityLevel,
    } = userContext;

    const systemInstruction = `Você é o "Coach Express", um mentor de emagrecimento, jejum intermitente e rotina saudável para pessoas ocupadas e sem tempo para dietas malucas.
Sua filosofia:
- Praticidade máxima: soluções rápidas, sem receitas complicadas de 1 hora.
- Ciência sem mitos: explica de forma simples insulina, queima de gordura, cetose, autofagia e déficit calórico.
- Acolhedor, motivador, mas firme e objetivo (respostas concisas de 2 a 4 parágrafos ou passos claros com tópicos).
- Quando o usuário relatar que travou no peso (platô), dê 2-3 ajustes pontuais sem cortar comida drasticamente.
- Quando relatar fome no jejum, explique o hormônio grelina (que vem em ondas) e sugira água com gás, café preto, chá verde ou pitada de sal marinho.

Dados atuais do aluno:
- Peso Atual: ${currentWeight ? `${currentWeight} kg` : "Não informado"}
- Peso Inicial: ${initialWeight ? `${initialWeight} kg` : "Não informado"}
- Meta de Peso: ${goalWeight ? `${goalWeight} kg` : "Não informado"}
- Status do Jejum: ${isFasting ? `Em jejum há ${currentFastingHours || 0}h (Protocolo: ${fastingProtocol || "16:8"}, Fase metabólica: ${fastingPhase || "Cetose"})` : "Na janela de alimentação"}
- Calorias Hoje: ${caloriesToday || 0} kcal consumidas de ${calorieGoal || 2000} kcal meta
- Água Hoje: ${waterToday || 0} ml de ${waterGoal || 2500} ml meta
- Sequência de jejuns (Streak): ${streakDays || 0} dias consecutivos batidos
- Nível de Atividade: ${activityLevel || "Moderado"}

Responda sempre em português do Brasil de forma empática, prática e direta ao ponto.`;

    // Format chat history
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      reply: response.text || "Desculpe, tive uma oscilação na resposta. Pode repetir?",
    });
  } catch (error: any) {
    console.error("Erro no chat do coach:", error);
    return res.status(500).json({
      error: error?.message || "Erro ao consultar o Coach.",
    });
  }
});

// Setup Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rotina Saudável Express rodando na porta ${PORT}`);
  });
}

start();
