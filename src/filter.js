const GROUPS = [
  {
    name: "Yapay Zekâ",
    color: 0x8b5cf6,
    strong: [
      "yapay zeka", "artificial intelligence", " ai ", "ai modeli", "ai model",
      "makine ogrenmesi", "machine learning", "derin ogrenme", "deep learning",
      "llm", "buyuk dil modeli", "chatgpt", "openai", "gemini", "claude",
      "copilot", "mistral", "midjourney", "stable diffusion", "nvidia ai",
      "zeka modeli", "robotik", "robotics",
      // Çin merkezli yapay zekâ şirketleri ve model aileleri
      "deepseek", "deepseek r1", "deepseek v3", "deepseek v4",
      "chatglm", "glm-4", "glm-5", "glm 4", "glm 5", "zhipu ai", "z.ai",
      "qwen", "tongyi qianwen", "kimi ai", "kimi k2", "kimi k3", "moonshot ai",
      "doubao", "bytedance seed", "seedream", "seedance",
      "ernie bot", "ernie model", "ernie 4", "ernie 5", "wenxin yiyan",
      "hunyuan", "tencent hy", "tencent hy3", "yuanbao ai",
      "minimax", "hailuo ai", "baichuan", "baichuan4",
      "01.ai", "yi-lightning", "yi large model", "stepfun", "step model",
      "kling ai", "wan2", "wan 2", "cogvideo", "cogview", "internlm"
    ],
    titleOnly: ["kimi"],
    people: [
      "sam altman", "jensen huang", "demis hassabis", "dario amodei",
      "ilya sutskever", "mira murati", "mustafa suleyman", "yann lecun",
      "fei-fei li", "andrew ng", "liang wenfeng"
    ],
    weak: ["model", "agent", "ajan", "egitim verisi", "sinir agi", "uretimsel"]
  },
  {
    name: "Yazılım",
    color: 0x2563eb,
    strong: [
      "yazilim", "software", "isletim sistemi", "windows", "linux", "android",
      "ios ", "macos", "uygulama", "application", "guncelleme", "update",
      "programlama", "developer", "gelistirici", "github", "acik kaynak",
      "open source", "tarayici", "browser", "veritabani", "database", "api ",
      "bulut", "cloud", "sistem acigi", "guvenlik acigi"
    ],
    weak: ["microsoft", "google", "apple", "meta", "samsung", "surum", "platform"]
  },
  {
    name: "Siber Güvenlik",
    color: 0xef4444,
    strong: [
      "siber", "cyber", "hack", "hacker", "fidye yazilimi", "ransomware",
      "malware", "zararli yazilim", "veri sizintisi", "guvenlik ihlali",
      "kimlik avi", "phishing", "zero day", "0-day", "saldiri", "parola"
    ],
    weak: ["guvenlik", "gizlilik", "privacy", "sifreleme", "cuzdan"]
  },
  {
    name: "Teknoloji",
    color: 0x06b6d4,
    strong: [
      "kuantum", "quantum", "yariletken", "semiconductor", "mikrocip", "cip uretimi",
      "veri merkezi", "data center", "super bilgisayar", "supercomputer",
      "internet altyapisi", "uydu internet", "6g ", "5g altyapi", "artirilmis gerceklik",
      "sanal gerceklik", "blockchain", "robot", "drone teknolojisi"
    ],
    weak: ["teknoloji", "dijital", "inovasyon", "arastirmaci", "muhendis"]
  }
];

const BLOCKED = [
  "sinema", "film", "dizi", "marvel", "netflix", "disney", "oyuncu kadrosu",
  "fragman", "vizyon", "box office", "ucretsiz oyun", "epic games", "playstation",
  "xbox", "steam indirimi", "oyun satis", "otomobil", "otomotiv", "suv", "sedan",
  "elektrikli arac", "sarj parki", "motor hacmi", "beygir", "ucak", "savas uca",
  "savunma sanayi", "a101", "bim ", "sok market", "indirim", "kampanya",
  "fiyat dustu", "ne kadar", "borsa", "hisse", "kripto para fiyati"
];

const HARDWARE_ONLY = [
  "telefon ozellikleri", "kamera ozellikleri", "akilli saat", "kulaklik", "monitor",
  "ekran karti", "tablet ozellikleri", "laptop ozellikleri", "tanitildi", "sizdirildi"
];

export function normalizeText(value = "") {
  return ` ${value.toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9+#.\-]+/g, " ")
    .replace(/\s+/g, " ") } `;
}

function countHits(text, words) {
  return words.reduce((total, word) => total + (text.includes(normalizeText(word)) ? 1 : 0), 0);
}

export function classifyArticle(article) {
  const title = normalizeText(article.title);
  const body = normalizeText(`${article.title} ${article.description}`);
  const blockedHits = countHits(body, BLOCKED);

  let best = { category: null, color: 0x64748b, score: 0, strongHits: 0 };
  for (const group of GROUPS) {
    const titleStrong = countHits(title, [...group.strong, ...(group.titleOnly || []), ...(group.people || [])]);
    const bodyStrong = countHits(body, [...group.strong, ...(group.people || [])]);
    const weakHits = countHits(body, group.weak);
    const score = titleStrong * 5 + bodyStrong * 3 + weakHits;
    if (score > best.score) {
      best = { category: group.name, color: group.color, score, strongHits: titleStrong + bodyStrong };
    }
  }

  const hardwareOnly = countHits(body, HARDWARE_ONLY) > 0;
  const hasFocusedSignal = best.strongHits > 0;
  const blockedWithoutStrongFocus = blockedHits > 0 && best.score < 8;
  const genericHardware = hardwareOnly && best.score < 8;
  const matched = hasFocusedSignal && best.score >= 3 && !blockedWithoutStrongFocus && !genericHardware;

  return {
    matched,
    category: best.category || "Teknoloji",
    color: best.color,
    score: best.score,
    reason: matched ? "odak konuyla eşleşti" : blockedWithoutStrongFocus ? "istenmeyen konu" : genericHardware ? "yalnızca donanım/ürün haberi" : "yeterli eşleşme yok"
  };
}

export const filterSummary = "Yapay zekâ, yazılım, siber güvenlik ve odak teknoloji";
