import { DietPlan, FastingPhaseInfo, FastingProtocolType, UserProfile, WorkoutRoutine, FastingHistoryItem, WeightLog } from "../types";

export const FASTING_PROTOCOLS: {
  type: FastingProtocolType;
  fastHours: number;
  eatHours: number;
  title: string;
  description: string;
  badge: string;
}[] = [
  {
    type: "16:8",
    fastHours: 16,
    eatHours: 8,
    title: "16:8 LeanGains",
    description: "O mais popular e sustentável. Janela de alimentação das 12h às 20h.",
    badge: "Mais Recomendado",
  },
  {
    type: "18:6",
    fastHours: 18,
    eatHours: 6,
    title: "18:6 Queima Acelerada",
    description: "Aumenta o tempo em cetose profunda e autofagia moderada.",
    badge: "Intermediário",
  },
  {
    type: "20:4",
    fastHours: 20,
    eatHours: 4,
    title: "20:4 Janela Guerreiro",
    description: "4 horas de alimentação e 20 horas de queima contínua de gordura.",
    badge: "Avançado",
  },
  {
    type: "OMAD",
    fastHours: 23,
    eatHours: 1,
    title: "OMAD (23:1)",
    description: "Uma refeição completa e nutritiva por dia. Máxima conveniência.",
    badge: "Intenso",
  },
];

export const FASTING_PHASES: FastingPhaseInfo[] = [
  {
    name: "Digestão e Insulina",
    minHours: 0,
    maxHours: 4,
    color: "#3b82f6",
    badgeBg: "bg-blue-500/10 text-blue-600 border-blue-200",
    icon: "Utensils",
    summary: "O corpo está digerindo a última refeição.",
    metabolicEffect: "A glicose sanguínea e a insulina sobem para absorver nutrientes. A queima de gordura fica em pausa enquanto a energia dos alimentos é utilizada.",
  },
  {
    name: "Queda de Insulina e Glicogênio",
    minHours: 4,
    maxHours: 12,
    color: "#eab308",
    badgeBg: "bg-amber-500/10 text-amber-700 border-amber-200",
    icon: "Flame",
    summary: "Insulina em nível basal e uso das reservas de glicogênio.",
    metabolicEffect: "O fígado esgota gradualmente o glicogênio hepático. O organismo começa a liberar ácidos graxos dos adipócitos para suprir energia.",
  },
  {
    name: "Cetose Ativa & Queima de Gordura",
    minHours: 12,
    maxHours: 16,
    color: "#f97316",
    badgeBg: "bg-orange-500/10 text-orange-600 border-orange-200",
    icon: "Zap",
    summary: "Gordura corporal se torna o combustível principal.",
    metabolicEffect: "A produção de corpos cetônicos (beta-hidroxibutirato) acelera. Clareza mental, menor oscilação de apetite e intensa lipólise.",
  },
  {
    name: "Autofagia e Reparo Celular",
    minHours: 16,
    maxHours: 20,
    color: "#10b981",
    badgeBg: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    icon: "Sparkles",
    summary: "Reciclagem celular e renovação das mitocôndrias.",
    metabolicEffect: "Processo descoberto pelo Prêmio Nobel de 2016: as células identificam proteínas defeituosas e organelas velhas para reaproveitamento.",
  },
  {
    name: "Autofagia Profunda e Pico de GH",
    minHours: 20,
    maxHours: 48,
    color: "#8b5cf6",
    badgeBg: "bg-purple-500/10 text-purple-700 border-purple-200",
    icon: "ShieldAlert",
    summary: "Pico de hormônio do crescimento (preservando massa magra).",
    metabolicEffect: "O GH sobe para proteger os músculos contra degradação enquanto o sistema imune inicia regeneração de glóbulos brancos.",
  },
];

export const SCIENTIFIC_TOPICS = [
  {
    id: "fases-jejum",
    category: "Fisiologia",
    title: "As 4 Fases Metabólicas do Jejum",
    readTime: "3 min de leitura",
    summary: "Como o corpo transita do modo armazenamento para queima pura de gordura.",
    keyPoints: [
      "0-4h: Digestão e estocagem de glicogênio.",
      "4-12h: Queda vertical da insulina, liberando a chave da lipólise.",
      "12-16h: Cetose leve a moderada com clareza mental.",
      "16-24h: Autofagia ativa, reparando organelas celulares e reduzindo inflamação.",
    ],
    details:
      "A chave mestra do emagrecimento com jejum não é mágica, é a redução crônica da insulina. Na presença de insulina alta (quando comemos o tempo todo), a enzima LPL bloqueia a saída de gordura das células. Quando o jejum ultrapassa 12 horas, a lipase sensível a hormônio (HSL) é liberada para transformar triglicerídeos em energia.",
  },
  {
    id: "o-que-quebra",
    category: "Prática Express",
    title: "O que Quebra e o que NÃO Quebra o Jejum?",
    readTime: "2 min de leitura",
    summary: "Guia definitivo para não sabotar seu jejum durante o dia de trabalho.",
    keyPoints: [
      "NÃO QUEBRA: Café preto puro, chás sem açúcar (verde, mate, camomila), água com gás e limão espremido, pitada de sal marinho nos eletrólitos.",
      "PODE QUEBRAR SE EM EXCESSO: Adoçantes artificiais podem gerar resposta cefálica em pessoas sensíveis. Prefira Stévia pura ou Eritritol com moderação.",
      "QUEBRA TOTALMENTE: Leite ou creme no café, açúcar, sucos de frutas, BCAA, Whey Protein, creatina com sabor maltodextrina, balas.",
    ],
    details:
      "O jejum metabólico para emagrecimento tolera até ~15 calorias líquidas isoladas (como um respingo de limão), porém para autofagia máxima, mantenha calorias estritamente em zero. Se sentir dor de cabeça ou tontura no trabalho, o motivo comum é falta de sódio e magnésio, não de comida!",
  },
  {
    id: "refeed-seguro",
    category: "Digestão",
    title: "Refeed Inteligente: Como Quebrar o Jejum",
    readTime: "2 min de leitura",
    summary: "Evite sonolência pós-prandial e picos violentos de insulina.",
    keyPoints: [
      "Nunca quebre jejum de 16h+ com farinhas brancas, massas ou doces (isso causa pico de glicose e moleza).",
      "Primeiro passo: Beba um copo de água 15 minutos antes da refeição.",
      "Combinação ideal: Proteína de fácil digestão (ovos mexidos, frango, peixe) + vegetais verdes cozidos ou salada com azeite.",
      "Se for usar carboidratos, consuma por último no prato para amortecer o impacto glicêmico.",
    ],
    details:
      "Depois de horas em jejum, suas células estão hipersensíveis à insulina. Se você consumir carboidratos refinados primeiro, terá uma montanha-russa de glicose seguida por sono súbito e fome incontrolável 2 horas depois. Começar pelas proteínas e fibras preserva sua saciedade pelo resto do dia.",
  },
  {
    id: "plato-peso",
    category: "Estratégia",
    title: "Como Destravar o Peso sem Passar Fome",
    readTime: "3 min de leitura",
    summary: "Táticas comprovadas para quando a balança estacionar por mais de 10 dias.",
    keyPoints: [
      "Platô real vs retenção de água: Músculos inflamados após treino retêm até 1.5kg de água.",
      "Ajuste a janela: Se faz sempre 16:8, faça 2 dias de 18:6 ou 1 dia OMAD.",
      "Refeed Day (Diet Break de 48h): Comer nas calorias de manutenção por 2 dias restaura o hormônio leptina e o gasto basal.",
      "Monitore os 'beliscos invisíveis': castanhas aos punhados e azeite no olho costumam somar 400 kcal desapercebidas.",
    ],
    details:
      "O corpo humano é uma máquina de sobrevivência. Após semanas de déficit calórico constante, a glândula tireoide diminui a conversão de T4 em T3 e o movimento espontâneo (NEAT) cai. Um refeed planejado de 48h sem culpa é a ferramenta científica mais eficiente para religar o termostato metabólico.",
  },
  {
    id: "adaptacao-metabolica",
    category: "Ciência",
    title: "Adaptação Metabólica: Por que Dietas Restritivas Falham",
    readTime: "3 min de leitura",
    summary: "Como o jejum intermitente preserva a taxa metabólica basal.",
    keyPoints: [
      "Em dietas tradicionais de cortar calorias o dia inteiro com 6 refeições pequenas, a TMB cai em até 30%.",
      "No jejum intermitente, os níveis de noradrenalina sobem nas primeiras 24-36 horas, mantendo a taxa metabólica ativa.",
      "O consumo adequado de proteína (1.6 a 2.0g por kg de peso) protege a massa magra.",
      "Treinos curtos de HIIT ou estímulo neuromuscular mandam o sinal ao cérebro para poupar os músculos.",
    ],
    details:
      "Estudos mostram que períodos sem alimento aumentam os hormônios contrarreguladores (epinefrina, hormônio do crescimento) que impedem o corpo de entrar no chamado 'modo de fome' precoce. Você gasta energia para caçar/procurar alimento — uma herança evolutiva a nosso favor.",
  },
];

export const DIET_PLANS: DietPlan[] = [
  {
    id: "low_carb",
    title: "Low-Carb Prático Express",
    subtitle: "Para quem quer agilidade, saciedade e zero complicação na cozinha",
    idealFor: "Rotinas de escritório e quem come fora ou faz marmitas rápidas",
    dailyCalories: 1550,
    macros: { protein: 125, carbs: 45, fat: 85 },
    meals: [
      {
        name: "Quebra do Jejum: Omelete Turbo com Queijo e Tomate",
        type: "Quebra do Jejum",
        prepTime: "7 minutos",
        calories: 380,
        protein: 28,
        carbs: 4,
        fat: 26,
        ingredients: [
          "3 ovos caipiras batidos",
          "30g de queijo minas curado ou muçarela",
          "1 colher de chá de manteiga ou azeite",
          "Tomatinhos picados e orégano",
        ],
        steps:
          "Aqueça a frigideira, doure os ovos mexendo rápido, adicione o queijo e tomates no centro, dobre e sirva com café ou água com gás.",
      },
      {
        name: "Almoço/Marmita: Bowl de Frango Grelhado, Brócolis e Castanhas",
        type: "Refeição Principal",
        prepTime: "12 minutos",
        calories: 590,
        protein: 52,
        carbs: 18,
        fat: 32,
        ingredients: [
          "180g de filé de peito de frango em tiras",
          "1 xícara de brócolis cozido no vapor",
          "Salada verde de rúcula e alface",
          "1 colher de sopa de azeite extra-virgem e sementes",
        ],
        steps:
          "Grelhe as tiras de frango com alho e sal. Monte o prato colorido com brócolis e regue com azeite generoso.",
      },
      {
        name: "Jantar Leve: Peixe com Purê de Abóbora ou Carne Moída Especial",
        type: "Jantar Leve",
        prepTime: "15 minutos",
        calories: 580,
        protein: 45,
        carbs: 23,
        fat: 27,
        ingredients: [
          "180g de carne moída de patinho ou filé de tilápia",
          "Legumes refogados (abobrinha, cenoura ralada, cebola)",
          "Azeite de oliva e folhas frescas",
        ],
        steps:
          "Refogue a carne com temperos naturais rápidos. Combine com abobrinha em rodelas na mesma frigideira para poupar louça.",
      },
    ],
  },
  {
    id: "keto",
    title: "Cetogênica Alta Queima (Keto)",
    subtitle: "Máxima queima de gordura e fome zero ao longo do expediente",
    idealFor: "Pessoas que querem eliminar a compulsão por doces e focar no trabalho",
    dailyCalories: 1600,
    macros: { protein: 110, carbs: 22, fat: 120 },
    meals: [
      {
        name: "Desjejum Cetogênico: Ovos com Bacon e Abacate",
        type: "Quebra do Jejum",
        prepTime: "8 minutos",
        calories: 520,
        protein: 26,
        carbs: 6,
        fat: 42,
        ingredients: [
          "3 ovos fritos na manteiga",
          "2 fatias de bacon crocante",
          "1/2 abacate com flor de sal e limão",
        ],
        steps:
          "Frite o bacon na própria gordura, adicione os ovos na sequência. Fatie o abacate com sal e azeite.",
      },
      {
        name: "Prato Principal: Salmão ou Coxa de Frango com Salada Caesar Keto",
        type: "Refeição Principal",
        prepTime: "15 minutos",
        calories: 680,
        protein: 48,
        carbs: 7,
        fat: 50,
        ingredients: [
          "200g de filé de salmão ou sobrecoxa desossada",
          "Mix de folhas escuras crocantes",
          "Molho de azeite, mostarda dijon e parmesão ralado",
          "30g de nozes ou castanhas do pará",
        ],
        steps:
          "Doure a proteína até ficar crocante. Misture as folhas com o molho caseiro e finalize com queijo curado.",
      },
      {
        name: "Lanche de Fechamento da Janela: Mousse de Cacau Rápido",
        type: "Lanche Rápido",
        prepTime: "3 minutos",
        calories: 400,
        protein: 36,
        carbs: 9,
        fat: 28,
        ingredients: [
          "1 dose de Whey Protein (baunilha ou chocolate)",
          "1 colher de sopa de pasta de amendoim integral 100%",
          "2 colheres de iogurte grego sem açúcar",
          "Cacau em pó 100%",
        ],
        steps:
          "Misture com uma colher até virar um creme denso e delicioso. Consuma antes de disparar o timer do jejum.",
      },
    ],
  },
  {
    id: "mediterranean",
    title: "Mediterrânea Flexível",
    subtitle: "Rica em antioxidantes, azeite de oliva, peixes e energia estável",
    idealFor: "Quem busca longevidade, flexibilidade social e disposição sem rigidez",
    dailyCalories: 1650,
    macros: { protein: 120, carbs: 95, fat: 80 },
    meals: [
      {
        name: "Quebra Suave: Iogurte Grego com Frutas Vermelhas e Nozes",
        type: "Quebra do Jejum",
        prepTime: "4 minutos",
        calories: 360,
        protein: 26,
        carbs: 22,
        fat: 16,
        ingredients: [
          "170g de iogurte natural integral de consistência firme",
          "1 punhado de morangos ou mirtilos frescos",
          "20g de castanhas trituradas e sementes de chia",
          "Fiozinho de mel puro (opcional)",
        ],
        steps:
          "Monte a tigela em menos de 2 minutos. Nutrição direta com probióticos para a flora intestinal.",
      },
      {
        name: "Almoço do Mar: Filé de Peixe com Legumes Assados e Quinoa",
        type: "Refeição Principal",
        prepTime: "15 minutos",
        calories: 640,
        protein: 48,
        carbs: 45,
        fat: 28,
        ingredients: [
          "200g de filé de pescada ou atum grelhado",
          "4 colheres de sopa de quinoa cozida",
          "Tomate cereja, azeitonas pretas e cebola roxa",
          "Muito azeite de oliva extravirgem",
        ],
        steps:
          "Refogue os tomatinhos com as azeitonas e disponha sobre o peixe bem dourado.",
      },
      {
        name: "Jantar Conforto: Frango Desfiado com Grão-de-Bico e Rúcula",
        type: "Jantar Leve",
        prepTime: "8 minutos",
        calories: 650,
        protein: 46,
        carbs: 28,
        fat: 36,
        ingredients: [
          "160g de peito de frango cozido desfiado",
          "1/2 xícara de grão de bico cozido",
          "Rúcula, azeite de oliva, limão e orégano",
          "Cubos de queijo feta ou queijo branco",
        ],
        steps:
          "Misture tudo em um bowl temperando com azeite de qualidade. Prático e completo.",
      },
    ],
  },
];

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: "tabata-express-12",
    title: "Tabata Queima Express (12 Min)",
    tag: "Tabata",
    durationMin: 12,
    level: "Iniciante",
    caloriesBurn: 180,
    description: "Método 20s de esforço máximo por 10s de descanso. Eleva o EPOC (queima pós-treino) durante o jejum.",
    rounds: 3,
    exercises: [
      {
        name: "Polichinelos Rápidos",
        workSeconds: 20,
        restSeconds: 10,
        instruction: "Mantenha o ritmo constante na ponta dos pés, ativando a panturrilha e a circulação.",
      },
      {
        name: "Agachamento com Peso Corporal",
        workSeconds: 20,
        restSeconds: 10,
        instruction: "Pés na largura dos ombros, desça o quadril empurrando os calcanhares no chão.",
      },
      {
        name: "Corrida Estacionária com Joelhos Altos",
        workSeconds: 20,
        restSeconds: 10,
        instruction: "Eleve os joelhos com intensidade moderada bombeando os braços.",
      },
      {
        name: "Prancha Abdominal Isométrica",
        workSeconds: 20,
        restSeconds: 10,
        instruction: "Cotovelos no chão, abdômen e glúteos contraídos sem deixar o quadril cair.",
      },
    ],
  },
  {
    id: "hiit-derrete-15",
    title: "HIIT 15 Min Derrete Gordura",
    tag: "HIIT",
    durationMin: 15,
    level: "Intermediário",
    caloriesBurn: 240,
    description: "Treino de alta densidade sem halteres. Excelente para ativar o hormônio HSL e preservar massa magra.",
    rounds: 3,
    exercises: [
      {
        name: "Burpees Sem Flexão (Sprawl)",
        workSeconds: 40,
        restSeconds: 20,
        instruction: "Mãos no chão, chute as pernas para trás em prancha, volte e dê um pequeno salto.",
      },
      {
        name: "Mountain Climbers (Escaladores)",
        workSeconds: 40,
        restSeconds: 20,
        instruction: "Posição de flexão, puxe os joelhos alternadamente em direção ao peito com fôlego.",
      },
      {
        name: "Afundo / Passada Alternada",
        workSeconds: 40,
        restSeconds: 20,
        instruction: "Dê um passo à frente, encostando quase o joelho de trás no solo com o tronco reto.",
      },
      {
        name: "Flexão de Braço (ou com Joelhos Apoiados)",
        workSeconds: 40,
        restSeconds: 20,
        instruction: "Desça o peitoral controlado e empurre o chão com vigor.",
      },
      {
        name: "Polichinelo Cruzado (Jumping Jack Cross)",
        workSeconds: 40,
        restSeconds: 20,
        instruction: "Abra e feche os braços e pernas cruzando na frente para soltar os ombros.",
      },
    ],
  },
  {
    id: "emom-forca-20",
    title: "EMOM 20 Min Força & Fôlego",
    tag: "EMOM",
    durationMin: 20,
    level: "Avançado",
    caloriesBurn: 310,
    description: "Every Minute On the Minute: cumpra as repetições no início do minuto e descanse o restante.",
    rounds: 4,
    exercises: [
      {
        name: "Minuto 1: 15 Agachamentos com Salto",
        workSeconds: 35,
        restSeconds: 25,
        instruction: "Faça 15 agachamentos explosivos. O tempo restante até 60s é seu descanso.",
      },
      {
        name: "Minuto 2: 12 Flexões de Braço Estritas",
        workSeconds: 30,
        restSeconds: 30,
        instruction: "Peitoral toca quase o chão. Finalize e respire até o próximo minuto começar.",
      },
      {
        name: "Minuto 3: 20 Abdominais Remador",
        workSeconds: 35,
        restSeconds: 25,
        instruction: "Corpo esticado, suba flexionando os joelhos e abraçando as pernas.",
      },
      {
        name: "Minuto 4: 25 Elevações Pélvicas com Glúteo Travado",
        workSeconds: 35,
        restSeconds: 25,
        instruction: "Deitado, erga o quadril no topo segurando 1 segundo e desça controlado.",
      },
      {
        name: "Minuto 5: Descanso Ativo / Hidratação",
        workSeconds: 15,
        restSeconds: 45,
        instruction: "Beba um gole de água, respire fundo e se prepare para a próxima volta.",
      },
    ],
  },
  {
    id: "express-escritorio-8",
    title: "Express Sem Suor (8 Min)",
    tag: "Express",
    durationMin: 8,
    level: "Iniciante",
    caloriesBurn: 90,
    description: "Feito para fazer no quarto ou sala entre reuniões. Ativa a circulação sem precisar trocar de roupa.",
    rounds: 2,
    exercises: [
      {
        name: "Panturrilha em Pé na Ponta dos Pés",
        workSeconds: 30,
        restSeconds: 15,
        instruction: "Suba na ponta dos pés, contraia 1 segundo e desça devagar (bomba muscular venosa).",
      },
      {
        name: "Agachamento Isométrico na Parede (Wall Sit)",
        workSeconds: 30,
        restSeconds: 15,
        instruction: "Encoste as costas na parede com os joelhos a 90 graus e respire com calma.",
      },
      {
        name: "Alongamento Torácico e Rotação de Ombros",
        workSeconds: 30,
        restSeconds: 15,
        instruction: "Abra bem os braços, estufando o peito para desfazer a postura de computador.",
      },
      {
        name: "Elevação Lateral de Pernas (Glúteo Médio)",
        workSeconds: 30,
        restSeconds: 15,
        instruction: "Apoiando na mesa ou cadeira, eleve a perna lateralmente 15s de cada lado.",
      },
    ],
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Aluno(a)",
  gender: "female",
  age: 32,
  heightCm: 168,
  currentWeight: 79.4,
  initialWeight: 84.0,
  goalWeight: 69.0,
  activityLevel: "light",
  preferredProtocol: "16:8",
  lossPace: "firm", // ~0.75kg/semana
  bmr: 1530,
  tdee: 2100,
  dailyCalorieTarget: 1600,
  dailyWaterTargetMl: 2800,
  targetDateEstimate: "12 semanas",
  onboarded: true,
  reminders: {
    fastingBreak: true,
    fastingWindowClose: true,
    waterReminder: true,
    weeklyWeighIn: true,
  },
};

export const INITIAL_FASTING_HISTORY: FastingHistoryItem[] = [
  {
    id: "fh-1",
    date: "Ontem",
    protocol: "16:8",
    targetHours: 16,
    actualHours: 16.5,
    startTime: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    completed: true,
    streakCountAtTime: 5,
  },
  {
    id: "fh-2",
    date: "Anteontem",
    protocol: "16:8",
    targetHours: 16,
    actualHours: 17.1,
    startTime: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 43 * 3600 * 1000).toISOString(),
    completed: true,
    streakCountAtTime: 4,
  },
  {
    id: "fh-3",
    date: "3 dias atrás",
    protocol: "16:8",
    targetHours: 16,
    actualHours: 16.0,
    startTime: new Date(Date.now() - 84 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 68 * 3600 * 1000).toISOString(),
    completed: true,
    streakCountAtTime: 3,
  },
  {
    id: "fh-4",
    date: "4 dias atrás",
    protocol: "18:6",
    targetHours: 18,
    actualHours: 18.3,
    startTime: new Date(Date.now() - 108 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 90 * 3600 * 1000).toISOString(),
    completed: true,
    streakCountAtTime: 2,
  },
  {
    id: "fh-5",
    date: "5 dias atrás",
    protocol: "16:8",
    targetHours: 16,
    actualHours: 16.2,
    startTime: new Date(Date.now() - 132 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 116 * 3600 * 1000).toISOString(),
    completed: true,
    streakCountAtTime: 1,
  },
  {
    id: "fh-6",
    date: "6 dias atrás",
    protocol: "16:8",
    targetHours: 16,
    actualHours: 14.5,
    startTime: new Date(Date.now() - 156 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() - 141.5 * 3600 * 1000).toISOString(),
    completed: false, // Parcial
    streakCountAtTime: 0,
  },
];

export const DEFAULT_USER_PROFILE = INITIAL_USER_PROFILE;

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  { id: "wl-1", date: "2026-08-01", weight: 84.0, note: "Início da jornada" },
  { id: "wl-2", date: "2026-08-08", weight: 83.1, note: "Primeira semana de jejum 16:8" },
  { id: "wl-3", date: "2026-08-15", weight: 82.2, note: "Menos retenção líquida" },
  { id: "wl-4", date: "2026-08-22", weight: 81.4, note: "Energia em jejum está ótima" },
  { id: "wl-5", date: "2026-08-29", weight: 80.5, note: "Fim do primeiro mês (-3.5kg)" },
  { id: "wl-6", date: "2026-09-05", weight: 79.9, note: "Quebrando a barreira dos 80kg" },
  { id: "wl-7", date: "2026-09-12", weight: 79.4, note: "Pesagem atual" },
];
