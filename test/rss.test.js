import test from "node:test";
import assert from "node:assert/strict";
import { parseRss, parseJinaFeed, parseJinaArticle } from "../src/rss.js";

test("RSS görselini ve temiz açıklamayı ayrıştırır", () => {
  const xml = `<?xml version="1.0"?><rss><channel><item><title>Test &amp; Haber</title><description><![CDATA[<img src="https://img/inline.jpg" />Kısa <b>açıklama</b>.]]></description><link>https://example.com/1</link><guid>id-1</guid><pubDate>Sun, 02 Aug 2026 13:00:00 +0300</pubDate><enclosure url="https://img/main.jpg" type="image/jpeg" /></item></channel></rss>`;
  const [item] = parseRss(xml);
  assert.equal(item.title, "Test & Haber");
  assert.equal(item.description, "Kısa açıklama.");
  assert.equal(item.image, "https://img/main.jpg");
});
test("Jina RSS yedeğini haber listesine dönüştürür", () => {
  const markdown = `Title: DonanımHaber\n\nMarkdown Content:\n### [Yeni haber başlığı](https://www.donanimhaber.com/yeni-haber--123)\n\n[https://www.donanimhaber.com/yeni-haber--123](https://www.donanimhaber.com/yeni-haber--123)\n\nSun, 02 Aug 2026 16:30:00 +0300\n`;
  const [item] = parseJinaFeed(markdown);
  assert.equal(item.title, "Yeni haber başlığı");
  assert.equal(item.link, "https://www.donanimhaber.com/yeni-haber--123");
  assert.equal(item.needsEnrichment, true);
});

test("Jina haberinden görsel ve açıklama çıkarır", () => {
  const markdown = `Markdown Content:\n[![Image: haber](https://www.donanimhaber.com/images/images/haber/123/src/haber.jpg)](https://example.com)\n\nBu, Discord embed içerisinde kullanılacak yeterince uzun örnek haber açıklamasıdır ve ayrıştırılmalıdır.\n`;
  const detail = parseJinaArticle(markdown);
  assert.equal(detail.image, "https://www.donanimhaber.com/images/images/haber/123/src/haber.jpg");
  assert.match(detail.description, /Discord embed/);
});
