import test from "node:test";
import assert from "node:assert/strict";
import { classifyArticle } from "../src/filter.js";

const article = (title, description = "") => ({ title, description });

test("AI şirketleri ve modelleri doğrudan eşleşir", () => {
  for (const title of [
    "OpenAI GPT-5 modelini güncelledi", "Anthropic Claude için yeni özellik duyurdu",
    "Google Gemini modelini hızlandırdı", "Meta Llama ailesini genişletti",
    "DeepSeek yeni model yayınladı", "Alibaba Qwen modelini tanıttı",
    "Kimi yeni sürümünü duyurdu", "Zhipu AI GLM-5 modelini açtı",
    "Midjourney görsel modelini yeniledi", "Perplexity AI yeni özellik ekledi"
  ]) assert.equal(classifyArticle(article(title)).matched, true, title);
});

test("önemli AI kişileri doğrudan eşleşir", () => {
  for (const name of ["Sam Altman", "Jensen Huang", "Demis Hassabis", "Dario Amodei", "Liang Wenfeng", "Mira Murati", "Andrej Karpathy"]) {
    assert.equal(classifyArticle(article(`${name} yeni açıklama yaptı`)).matched, true, name);
  }
});

test("yazılım, güvenlik, donanım ve bilim teknolojilerini kabul eder", () => {
  for (const title of [
    "Windows yeni güncelleme aldı", "Linux için kritik yama yayınlandı",
    "Yeni fidye yazılımı şirketleri hedefliyor", "AMD yeni işlemcisini duyurdu",
    "Samsung Galaxy katlanabilir telefonunu tanıttı", "IBM kuantum bilgisayarda ilerleme kaydetti",
    "SpaceX yeni uydu fırlattı", "Katı hal batarya teknolojisinde yeni rekor",
    "Yeni elektrikli SUV modeli hızlı şarjla geliyor"
  ]) assert.equal(classifyArticle(article(title)).matched, true, title);
});

test("açıkça alakasız içerikleri eler", () => {
  for (const title of [
    "Yeni Marvel filmi için fragman yayınlandı", "Sinemada bu hafta hangi filmler var?",
    "A101 aktüel ürün kataloğu açıklandı", "Futbol maç sonucu belli oldu",
    "İspanya göçmen akını için yeni karar aldı"
  ]) assert.equal(classifyArticle(article(title)).matched, false, title);
});

test("Kimi yalnızca başlıkta tek başına marka sayılır", () => {
  assert.equal(classifyArticle(article("Kimi yeni modelini duyurdu")).matched, true);
  assert.equal(classifyArticle(article("Yeni tasarım yayınlandı", "Kimi kullanıcılar tasarımı beğenmedi.")).matched, false);
});
