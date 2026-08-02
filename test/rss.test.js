import test from "node:test";
import assert from "node:assert/strict";
import { parseRss } from "../src/rss.js";

test("RSS görselini ve temiz açıklamayı ayrıştırır", () => {
  const xml = `<?xml version="1.0"?><rss><channel><item><title>Test &amp; Haber</title><description><![CDATA[<img src="https://img/inline.jpg" />Kısa <b>açıklama</b>.]]></description><link>https://example.com/1</link><guid>id-1</guid><pubDate>Sun, 02 Aug 2026 13:00:00 +0300</pubDate><enclosure url="https://img/main.jpg" type="image/jpeg" /></item></channel></rss>`;
  const [item] = parseRss(xml);
  assert.equal(item.title, "Test & Haber");
  assert.equal(item.description, "Kısa açıklama.");
  assert.equal(item.image, "https://img/main.jpg");
});
