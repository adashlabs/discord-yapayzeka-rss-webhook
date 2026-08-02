const GROUPS = [
  {
    name: "Yapay Zekâ",
    color: 0x8b5cf6,
    strong: [
      "yapay zeka", "artificial intelligence", "generative ai", "uretken yapay zeka", "ai",
      "makine ogrenmesi", "machine learning", "derin ogrenme", "deep learning",
      "buyuk dil modeli", "large language model", "llm", "multimodal model",
      "akil yurutme modeli", "reasoning model", "temel model", "foundation model",
      "sinir agi", "neural network", "transformer model", "model egitimi",
      "openai", "chatgpt", "gpt-", "gpt 4", "gpt 5", "codex", "gpt image",
      "anthropic", "claude", "claude code", "google deepmind", "gemini", "gemma",
      "notebooklm", "imagen", "veo 3", "meta ai", "llama", "xai", "grok",
      "microsoft copilot", "github copilot", "mistral ai", "le chat", "mixtral",
      "perplexity ai", "cohere", "command r", "ai21", "jamba", "aleph alpha",
      "deepseek", "deepseek r1", "deepseek v3", "deepseek v4",
      "qwen", "tongyi qianwen", "chatglm", "glm-4", "glm-5", "glm 4", "glm 5",
      "zhipu ai", "z.ai", "kimi ai", "kimi k2", "kimi k3", "moonshot ai",
      "doubao", "bytedance seed", "seedream", "seedance", "ernie bot", "ernie model",
      "hunyuan", "tencent hy", "yuanbao ai", "minimax", "hailuo ai", "baichuan",
      "01.ai", "yi-lightning", "stepfun", "kling ai", "wan2", "wan 2",
      "cogvideo", "cogview", "internlm", "sensechat",
      "midjourney", "stable diffusion", "stability ai", "black forest labs", "flux model",
      "runway ai", "pika labs", "luma ai", "dream machine", "ideogram", "leonardo ai",
      "suno ai", "udio", "elevenlabs", "synthesia", "heygen", "character ai",
      "hugging face", "replicate ai", "together ai", "groq", "cerebras", "sambanova",
      "scale ai", "databricks ai", "mosaic ai", "nvidia ai", "nvidia nemo",
      "manus ai", "devin ai", "cursor ai", "windsurf", "replit agent",
      "ai agent", "yapay zeka ajani", "agentic ai", "rag sistemi", "vektor veritabani",
      "prompt muhendisligi", "fine tuning", "ince ayar", "model egitimi"
    ],
    titleOnly: ["kimi"],
    people: [
      "sam altman", "jensen huang", "demis hassabis", "dario amodei",
      "ilya sutskever", "mira murati", "mustafa suleyman", "yann lecun",
      "fei-fei li", "andrew ng", "geoffrey hinton", "yoshua bengio",
      "andrej karpathy", "jeff dean", "aidan gomez", "arthur mensch",
      "aravind srinivas", "alexandr wang", "liang wenfeng", "kai-fu lee",
      "noam shazeer", "emad mostaque", "satya nadella", "sundar pichai",
      "mark zuckerberg", "elon musk", "lisa su"
    ],
    weak: [
      "model", "ajan", "agent", "zeka", "egitim verisi", "token", "inference",
      "benchmark", "parametre", "veri seti", "dataset", "halusinasyon", "prompt"
    ]
  },
  {
    name: "Yazılım",
    color: 0x2563eb,
    strong: [
      "yazilim", "software", "isletim sistemi", "windows", "linux", "ubuntu",
      "debian", "fedora", "android", "ios", "ipados", "macos", "chromeos",
      "uygulama", "mobil uygulama", "web uygulamasi", "guncelleme", "yazilim guncellemesi",
      "programlama", "developer", "gelistirici", "kodlama", "kaynak kod", "github",
      "gitlab", "acik kaynak", "open source", "api", "sdk", "framework", "kutuphane",
      "javascript", "typescript", "python", "rust dili", "java", "kotlin", "swift",
      "react", "vue.js", "node.js", "docker", "kubernetes", "serverless",
      "veritabani", "database", "postgresql", "mysql", "mongodb", "redis",
      "bulut bilisim", "cloud computing", "aws", "azure", "google cloud",
      "tarayici", "browser", "chrome", "firefox", "edge tarayici",
      "whatsapp", "telegram", "signal", "discord", "sosyal medya platformu",
      "dosya gezgini", "arayuz", "kullanici arayuzu", "algoritma", "otomasyon"
    ],
    weak: ["microsoft", "google", "apple", "meta", "amazon", "surum", "platform", "ozellik"]
  },
  {
    name: "Siber Güvenlik",
    color: 0xef4444,
    strong: [
      "siber guvenlik", "cybersecurity", "siber saldiri", "hack", "hacker",
      "fidye yazilimi", "ransomware", "malware", "zararli yazilim", "casus yazilim",
      "spyware", "veri sizintisi", "guvenlik ihlali", "guvenlik acigi", "zafiyet",
      "kimlik avi", "phishing", "zero day", "0-day", "ddos", "botnet",
      "parola", "sifreleme", "encryption", "gizlilik", "privacy", "vpn",
      "antivirus", "guvenlik yamasi", "exploit", "dark web"
    ],
    weak: ["guvenlik", "saldiri", "hesap", "veri", "cuzdan", "kimlik"]
  },
  {
    name: "Donanım ve Teknoloji",
    color: 0x06b6d4,
    strong: [
      "teknoloji", "technology", "donanim", "hardware", "yariletken", "semiconductor",
      "islemci", "processor", "cpu", "gpu", "npu", "mikrocip", "cip uretimi",
      "ekran karti", "anakart", "ram bellek", "ssd", "depolama", "sunucu",
      "veri merkezi", "data center", "super bilgisayar", "supercomputer",
      "nvidia", "amd", "intel", "qualcomm", "mediatek", "arm islemci", "tsmc", "asml",
      "akilli telefon", "smartphone", "iphone", "ipad", "samsung galaxy", "xiaomi", "googlebook", "kamera",
      "huawei", "honor", "oneplus", "oppo", "vivo", "pixel telefon", "katlanabilir telefon",
      "tablet", "dizustu bilgisayar", "laptop", "macbook", "oyuncu bilgisayari",
      "monitor", "klavye", "fare", "kulaklik", "akilli saat", "giyilebilir teknoloji",
      "playstation", "xbox", "nintendo", "steam deck", "oyun motoru", "unreal engine",
      "sanal gerceklik", "virtual reality", "artirilmis gerceklik", "augmented reality",
      "karma gerceklik", "akilli gozluk", "vision pro", "meta quest",
      "robot", "robotik", "humanoid", "drone", "otonom sistem", "otonom surus",
      "elektrikli arac", "elektrikli otomobil", "elektrikli suv", "elektrikli mpv", "sarj teknolojisi", "hizli sarj",
      "lidar", "nesnelerin interneti", "iot", "akilli ev", "3d yazici",
      "5g", "6g", "wifi 7", "internet altyapisi", "fiber internet", "uydu internet",
      "starlink", "bluetooth", "usb4", "thunderbolt"
    ],
    weak: ["cihaz", "ekran", "kamera", "batarya", "sarj", "performans", "prototip", "muhendis"]
  },
  {
    name: "Bilim ve Gelecek",
    color: 0x10b981,
    strong: [
      "kuantum", "quantum", "uzay teknolojisi", "nasa", "spacex", "roket", "uydu",
      "astronomi", "otegezegen", "uzay arastirmasi",
      "uzay teleskobu", "mars gorevi", "ay gorevi", "biyoteknoloji", "genetik muhendisligi",
      "crispr", "noroteknoloji", "beyin bilgisayar arayuzu", "neuralink",
      "nukleer fuzyon", "fusion energy", "yenilenebilir enerji", "gunes paneli",
      "batarya teknolojisi", "kati hal batarya", "solid state battery", "hidrojen teknolojisi",
      "karbon yakalama", "nanoteknoloji", "yeni malzeme", "grafen"
    ],
    weak: ["bilim", "arastirma", "laboratuvar", "kesif", "universite", "enerji"]
  }
];

const BLOCKED = [
  "sinema", "vizyon", "box office", "oyuncu kadrosu", "fragman", "dizi finali",
  "yeni film", "marvel filmi", "netflix dizisi", "disney dizisi", "unlu oyuncu",
  "magazin", "futbol", "basketbol", "mac sonucu", "transfer haberi",
  "gocmen", "secim sonucu", "diplomatik kriz", "savas uca", "savunma sanayi",
  "a101", "bim", "sok market", "aktuel urun", "market katalogu", "indirim kuponu",
  "borsa", "hisse senedi", "kripto para fiyati"
];

export function normalizeText(value = "") {
  return ` ${value.toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9+#.\-]+/g, " ")
    .replace(/\s+/g, " ") } `;
}

function countHits(text, words = []) {
  return words.reduce((total, word) => total + (text.includes(normalizeText(word)) ? 1 : 0), 0);
}

export function classifyArticle(article) {
  const title = normalizeText(article.title);
  const body = normalizeText(`${article.title} ${article.description}`);
  const blockedHits = countHits(body, BLOCKED);
  let best = { category: null, color: 0x64748b, score: 0, strongHits: 0 };
  for (const group of GROUPS) {
    const titleTerms = [...group.strong, ...(group.titleOnly || []), ...(group.people || [])];
    const bodyTerms = [...group.strong, ...(group.people || [])];
    const titleStrong = countHits(title, titleTerms);
    const bodyStrong = countHits(body, bodyTerms);
    const weakHits = countHits(body, group.weak);
    const score = titleStrong * 5 + bodyStrong * 3 + weakHits;
    if (score > best.score) best = { category: group.name, color: group.color, score, strongHits: titleStrong + bodyStrong };
  }
  const blockedWithoutClearFocus = blockedHits > 0 && best.score < 8;
  const matched = best.strongHits > 0 && best.score >= 3 && !blockedWithoutClearFocus;
  return {
    matched,
    category: best.category || "Teknoloji",
    color: best.color,
    score: best.score,
    reason: matched ? "geniş teknoloji filtresiyle eşleşti" : blockedWithoutClearFocus ? "alakasız konu" : "teknoloji sinyali bulunamadı"
  };
}

export const filterSummary = "Geniş AI, yazılım, siber güvenlik, donanım, bilim ve teknoloji filtresi";
