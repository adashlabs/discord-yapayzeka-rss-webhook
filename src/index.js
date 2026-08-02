import { parseRss } from "./rss.js";

const filterSummary = "Filtre yok: RSS'teki tüm yeni haberler";

const RSS_URL = "https://www.donanimhaber.com/rss/tum/";
const STATE_KEY = "bot:state:v1";
const SEEN_TTL_SECONDS = 60 * 60 * 24 * 90;
const MAX_SEND_PER_RUN = 6;

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

async function articleKey(article) {
  const bytes = new TextEncoder().encode(article.guid || article.link);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `seen:${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function discordPayload(article, classification) {
  const date = new Date(article.pubDate);
  const embed = {
    author: {
      name: `DonanımHaber • ${classification.category}`,
      url: "https://www.donanimhaber.com/"
    },
    title: truncate(article.title, 256),
    url: article.link,
    description: truncate(article.description || "Haberi okumak için başlığa tıklayın.", 700),
    color: classification.color,
    fields: [
      { name: "Kategori", value: classification.category, inline: true },
      { name: "Kaynak", value: "DonanımHaber", inline: true }
    ],
    footer: { text: "Teknoloji Akışı • 5 dakikada bir kontrol edilir" }
  };
  if (!Number.isNaN(date.valueOf())) embed.timestamp = date.toISOString();
  if (article.image?.startsWith("https://")) embed.image = { url: article.image };
  return { username: "Teknoloji Haberleri", embeds: [embed], allowed_mentions: { parse: [] } };
}

async function sendDiscord(webhookUrl, payload) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(`${webhookUrl}${webhookUrl.includes("?") ? "&" : "?"}wait=true`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) return;
    const body = await response.text();
    if (response.status === 429 && attempt === 0) {
      let retryMs = 1000;
      try { retryMs = Math.min(5000, Math.ceil(Number(JSON.parse(body).retry_after) * 1000)); } catch {}
      await new Promise((resolve) => setTimeout(resolve, retryMs));
      continue;
    }
    throw new Error(`Discord webhook hatası (${response.status}): ${body.slice(0, 300)}`);
  }
}

async function readState(env) {
  return (await env.NEWS_STATE.get(STATE_KEY, "json")) || {
    initialized: false,
    checks: 0,
    sentTotal: 0,
    lastCheck: null,
    lastSent: null,
    lastError: null
  };
}

async function checkFeed(env) {
  if (!env.DISCORD_WEBHOOK_URL) throw new Error("DISCORD_WEBHOOK_URL secret'ı tanımlı değil.");

  const response = await fetch(RSS_URL, {
    headers: { "user-agent": "DH-Tech-Discord-Worker/1.0", accept: "application/rss+xml, application/xml;q=0.9" }
  });
  if (!response.ok) throw new Error(`RSS alınamadı (${response.status}).`);
  const articles = parseRss(await response.text());
  if (!articles.length) throw new Error("RSS içinde haber bulunamadı.");

  const state = await readState(env);
  const now = new Date().toISOString();

  // İlk çalışmada geçmiş haberleri yağdırmak yerine mevcut akışı başlangıç kabul et.
  if (!state.initialized) {
    await Promise.all(articles.map(async (article) => env.NEWS_STATE.put(await articleKey(article), "1", { expirationTtl: SEEN_TTL_SECONDS })));
    const next = { ...state, initialized: true, checks: state.checks + 1, lastCheck: now, lastError: null, baselineCount: articles.length };
    await env.NEWS_STATE.put(STATE_KEY, JSON.stringify(next));
    return { initialized: true, checked: articles.length, sent: 0 };
  }

  const candidates = [];
  for (const article of articles) {
    const key = await articleKey(article);
    if (await env.NEWS_STATE.get(key)) continue;
    candidates.push({
      article,
      classification: { category: "Yeni Haber", color: 0xf97316 },
      key
    });
  }

  candidates.sort((a, b) => new Date(a.article.pubDate) - new Date(b.article.pubDate));
  let sent = 0;
  for (const item of candidates.slice(0, MAX_SEND_PER_RUN)) {
    await sendDiscord(env.DISCORD_WEBHOOK_URL, discordPayload(item.article, item.classification));
    await env.NEWS_STATE.put(item.key, "sent", { expirationTtl: SEEN_TTL_SECONDS });
    sent += 1;
  }

  const next = {
    ...state,
    initialized: true,
    checks: state.checks + 1,
    sentTotal: state.sentTotal + sent,
    lastCheck: now,
    lastSent: sent ? now : state.lastSent,
    lastError: null
  };
  await env.NEWS_STATE.put(STATE_KEY, JSON.stringify(next));
  return { initialized: false, checked: articles.length, matched: candidates.length, sent };
}

async function recordError(env, error) {
  const state = await readState(env);
  await env.NEWS_STATE.put(STATE_KEY, JSON.stringify({
    ...state,
    checks: state.checks + 1,
    lastCheck: new Date().toISOString(),
    lastError: error instanceof Error ? error.message : String(error)
  }));
}

function escapeHtml(value) {
  return String(value ?? "—").replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
}

function statusPage(state, configured) {
  const healthy = configured && !state.lastError;
  const status = !configured ? "Webhook bekleniyor" : state.lastError ? "Kontrol gerekli" : state.initialized ? "Aktif" : "İlk kontrol bekleniyor";
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Teknoloji Haber Botu</title><style>
  :root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,sans-serif;background:#07111f;color:#e7eefb}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 10%,#172554 0,transparent 36%),radial-gradient(circle at 90% 80%,#164e63 0,transparent 32%),#07111f}.card{width:min(720px,100%);padding:32px;border:1px solid #ffffff1f;border-radius:24px;background:#0b1729dd;box-shadow:0 24px 80px #0008;backdrop-filter:blur(18px)}.top{display:flex;align-items:center;gap:16px}.icon{display:grid;place-items:center;width:54px;height:54px;border-radius:16px;background:linear-gradient(135deg,#8b5cf6,#06b6d4);font-size:27px}.eyebrow{color:#93c5fd;font-size:12px;letter-spacing:.16em;text-transform:uppercase}h1{margin:3px 0 0;font-size:clamp(25px,5vw,36px)}.status{display:inline-flex;align-items:center;gap:9px;margin:28px 0 22px;padding:9px 13px;border-radius:999px;background:${healthy ? "#064e3b" : "#713f12"};color:${healthy ? "#a7f3d0" : "#fde68a"};font-weight:700}.dot{width:9px;height:9px;border-radius:50%;background:currentColor;box-shadow:0 0 14px currentColor}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.metric{padding:17px;border:1px solid #ffffff12;border-radius:16px;background:#ffffff08}.label{color:#94a3b8;font-size:12px;margin-bottom:7px}.value{font-size:16px;font-weight:700;overflow-wrap:anywhere}.wide{grid-column:1/-1}.note{margin:22px 0 0;color:#94a3b8;line-height:1.6;font-size:14px}@media(max-width:560px){.card{padding:22px}.grid{grid-template-columns:1fr}.wide{grid-column:auto}}</style></head><body><main class="card"><div class="top"><div class="icon">⚡</div><div><div class="eyebrow">Cloudflare Worker</div><h1>Teknoloji Haber Botu</h1></div></div><div class="status"><span class="dot"></span>${escapeHtml(status)}</div><section class="grid"><div class="metric"><div class="label">Kontrol aralığı</div><div class="value">Her 5 dakika</div></div><div class="metric"><div class="label">Gönderilen haber</div><div class="value">${escapeHtml(state.sentTotal || 0)}</div></div><div class="metric"><div class="label">Son kontrol</div><div class="value">${escapeHtml(state.lastCheck ? new Date(state.lastCheck).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }) : "Henüz yok")}</div></div><div class="metric"><div class="label">Son gönderim</div><div class="value">${escapeHtml(state.lastSent ? new Date(state.lastSent).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }) : "Henüz yok")}</div></div><div class="metric wide"><div class="label">Aktif filtre</div><div class="value">${escapeHtml(filterSummary)}</div></div>${state.lastError ? `<div class="metric wide"><div class="label">Son hata</div><div class="value">${escapeHtml(state.lastError)}</div></div>` : ""}</section><p class="note">Eski haberler ilk kurulumda gönderilmez. Bot yalnızca kurulumdan sonra yayınlanan, odak filtreyle eşleşen yeni haberleri görselli Discord embed'i olarak paylaşır.</p></main></body></html>`;
}

export default {
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(checkFeed(env).catch(async (error) => {
      console.error(error);
      await recordError(env, error);
      throw error;
    }));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const state = await readState(env);
    if (url.pathname === "/health") {
      return Response.json({
        ok: Boolean(env.DISCORD_WEBHOOK_URL) && !state.lastError,
        configured: Boolean(env.DISCORD_WEBHOOK_URL),
        schedule: "*/5 * * * *",
        filter: filterSummary,
        ...state
      }, { headers: { "cache-control": "no-store" } });
    }
    return new Response(statusPage(state, Boolean(env.DISCORD_WEBHOOK_URL)), {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
    });
  }
};

export { checkFeed, discordPayload };
