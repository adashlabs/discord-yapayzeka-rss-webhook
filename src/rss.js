function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function tag(xml, name) {
  return decodeXml(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1]?.trim() || "");
}

function cleanHtml(html = "") {
  return decodeXml(html)
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

export function parseRss(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const raw = match[1];
    const rawDescription = tag(raw, "description");
    const enclosure = raw.match(/<enclosure\b[^>]*\burl=["']([^"']+)["'][^>]*>/i)?.[1];
    const inlineImage = rawDescription.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)?.[1];
    const link = tag(raw, "link");
    return {
      title: tag(raw, "title"),
      description: cleanHtml(rawDescription),
      link,
      guid: tag(raw, "guid") || link,
      pubDate: tag(raw, "pubDate"),
      image: decodeXml(enclosure || inlineImage || "")
    };
  });
  return items.filter((item) => item.title && item.link);
}
