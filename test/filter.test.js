import test from "node:test";
import assert from "node:assert/strict";
import { classifyArticle } from "../src/filter.js";
import { parseRss } from "../src/rss.js";

const article = (title, description = "") => ({ title, description });

test("yapay zekâ ve yazılım haberlerini kabul eder", () => {
  assert.equal(classifyArticle(article("Google yeni Gemini yapay zeka modelini duyurdu")).matched, true);
  assert.equal(classifyArticle(article("Windows 11 güncellemesi Dosya Gezgini'ni hızlandırıyor")).matched, true);
  assert.equal(classifyArticle(article("Kritik güvenlik açığı için yama yayınlandı", "Siber saldırı riski giderildi.")).matched, true);
});

test("Çin merkezli yapay zekâ model ailelerini güçlü eşleşme sayar", () => {
  const titles = [
    "DeepSeek yeni modelini duyurdu",
    "Zhipu AI, GLM-5 modelini yayınladı",
    "Alibaba Qwen ailesini güncelledi",
    "Moonshot AI, Kimi K3 modelini tanıttı",
    "Baidu ERNIE 5 modelini kullanıma açtı",
    "Tencent Hunyuan için yeni sürüm yayınladı",
    "MiniMax yeni yapay zekâ modelini tanıttı",
    "Baichuan4 performans testinde görüntülendi"
  ];
  for (const title of titles) {
    const result = classifyArticle(article(title));
    assert.equal(result.matched, true, title);
    assert.ok(result.score >= 5, `${title}: ${result.score}`);
  }
});

test("Kimi başlıkta doğrudan eşleşir ama açıklamada sıradan kullanımı eşleşmez", () => {
  assert.ok(classifyArticle(article("Kimi yeni modelini duyurdu")).score >= 5);
  assert.equal(classifyArticle(article("Yeni tasarım yayınlandı", "Kimi kullanıcılar tasarımı beğenmedi.")).matched, false);
  assert.equal(classifyArticle(article("İyi bir telefon nasıl seçilir?")).matched, false);
});

test("önemli yapay zekâ yöneticileri başlıkta 5 puan alır", () => {
  for (const name of ["Sam Altman", "Jensen Huang", "Demis Hassabis", "Dario Amodei", "Liang Wenfeng"]) {
    const result = classifyArticle(article(`${name} yeni açıklama yaptı`));
    assert.equal(result.matched, true, name);
    assert.ok(result.score >= 5, `${name}: ${result.score}`);
  }
});
test("eğlence, otomobil, kampanya ve salt donanım haberlerini eler", () => {
  assert.equal(classifyArticle(article("Marvel yeni filminin fragmanını yayınladı")).matched, false);
  assert.equal(classifyArticle(article("Yeni elektrikli SUV modeli tanıtıldı")).matched, false);
  assert.equal(classifyArticle(article("A101 Samsung monitör satıyor, fiyatı belli oldu")).matched, false);
  assert.equal(classifyArticle(article("Galaxy S27 kamera özellikleri sızdırıldı")).matched, false);
});

test("RSS görselini ve temiz açıklamayı ayrıştırır", () => {
  const xml = `<?xml version="1.0"?><rss><channel><item><title>Test &amp; Haber</title><description><![CDATA[<img src="https://img/inline.jpg" />Kısa <b>açıklama</b>.]]></description><link>https://example.com/1</link><guid>id-1</guid><pubDate>Sun, 02 Aug 2026 13:00:00 +0300</pubDate><enclosure url="https://img/main.jpg" type="image/jpeg" /></item></channel></rss>`;
  const [item] = parseRss(xml);
  assert.equal(item.title, "Test & Haber");
  assert.equal(item.description, "Kısa açıklama.");
  assert.equal(item.image, "https://img/main.jpg");
});
