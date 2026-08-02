# Discord Yapay Zekâ RSS Webhook

DonanımHaber'in genel RSS akışını her 5 dakikada bir kontrol eden Cloudflare Worker. Geniş bir yapay zekâ, yazılım, siber güvenlik, donanım, bilim ve teknoloji filtresiyle seçilen yeni haberleri Discord kanalına görselli embed biçiminde gönderir.

## Özellikler

- RSS akışını 5 dakikada bir otomatik kontrol eder.
- İlk kurulumda eski haberleri Discord'a doldurmaz.
- Gönderilen haberleri 90 gün boyunca hatırlar ve tekrar göndermez.
- Yüzlerce AI şirketi, model, ürün ve önemli kişi adını doğrudan tanır.
- Haber görseli, başlık, açıklama, kategori, kaynak ve yayın tarihini içeren Discord embed'i oluşturur.
- Webhook adresini kaynak kodunda değil, şifreli Cloudflare Secret olarak saklar.
- Worker adresinde çalışma durumunu gösteren bir kontrol ekranı sunar.

# Türkçe kurulum rehberi

Kurulum GitHub üzerinden yapılır. Bilgisayarınıza Node.js veya başka bir program kurmanız gerekmez.

## 1. Discord webhook adresini oluşturun

1. Discord'da haberlerin gönderileceği kanalı açın.
2. **Kanalı Düzenle → Entegrasyonlar → Webhook'lar** bölümüne girin.
3. **Yeni Webhook** seçeneğine basın.
4. Webhook için bir ad ve isterseniz profil resmi belirleyin.
5. **Webhook URL'sini Kopyala** seçeneğine basın.

Webhook adresini kimseyle paylaşmayın ve GitHub dosyalarına yazmayın.

## 2. GitHub deposunu Cloudflare'a bağlayın

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) hesabınıza giriş yapın.
2. Sol menüden **Workers & Pages** bölümünü açın.
3. **Create application / Uygulama oluştur** seçeneğine basın.
4. **Import a repository / Depoyu içe aktar** bölümündeki **Get started** seçeneğini seçin.
5. GitHub hesabınızı Cloudflare'a bağlayın.
6. `adashlabs/discord-yapayzeka-rss-webhook` deposunu seçin.

Cloudflare yapılandırma ekranındaki değerler:

| Ayar | Değer |
| --- | --- |
| Worker/Project name | `donanimhaber-teknoloji-botu` |
| Production branch | `main` |
| Build command | Boş bırakın |
| Deploy command | `npx wrangler deploy` |
| Root directory | Boş bırakın veya `/` |

Ardından **Save and Deploy / Kaydet ve dağıt** seçeneğine basın.

> Worker adının `wrangler.jsonc` içindeki `donanimhaber-teknoloji-botu` adıyla aynı olması önemlidir.

## 3. Discord webhook secret'ını ekleyin

İlk dağıtım tamamlandıktan sonra:

1. Cloudflare'da oluşturulan `donanimhaber-teknoloji-botu` Worker'ını açın.
2. **Settings / Ayarlar → Variables and Secrets / Değişkenler ve Secret'lar** bölümüne girin.
3. **Add / Ekle** seçeneğine basın.
4. Tür olarak **Secret** seçin.
5. Variable name alanına tam olarak şunu yazın:

   ```text
   DISCORD_WEBHOOK_URL
   ```

6. Value alanına Discord'dan kopyaladığınız webhook adresini yapıştırın.
7. **Deploy / Dağıt** seçeneğine basarak kaydedin.

Webhook'u **Build variable** olarak değil, Worker'ın çalışma zamanındaki **Variables and Secrets** bölümünde oluşturun.

## 4. Otomatik ayarlar

Aşağıdaki ayarları normalde elle yapmanız gerekmez:

- `NEWS_STATE` isimli KV alanı ilk dağıtımda otomatik oluşturulur.
- `*/5 * * * *` Cron Trigger yapılandırması otomatik yüklenir.
- Her `main` dalı güncellemesinde Cloudflare otomatik olarak yeniden dağıtım yapar.

Cron Trigger'ın Cloudflare ağına yayılması birkaç dakika, nadiren 15 dakikaya kadar sürebilir.

## 5. Çalıştığını kontrol edin

Cloudflare'ın verdiği `workers.dev` adresini açın. Durum ekranında şunları görebilirsiniz:

- Botun aktif olup olmadığı
- Son RSS kontrol zamanı
- Toplam gönderilen haber sayısı
- Son gönderim zamanı
- Varsa son hata mesajı

Makine tarafından okunabilir durum bilgisi aynı adresin `/health` yolundadır.

İlk çalışmada mevcut RSS haberleri yalnızca başlangıç noktası olarak kaydedilir ve Discord'a gönderilmez. Kurulumdan sonra yayınlanan ilk eşleşen haber gönderilecektir.

## KV otomatik oluşmazsa

Otomatik KV oluşturma beta özelliğinde hesabınıza bağlı bir sorun yaşanırsa:

1. Worker'ı açın.
2. **Settings → Bindings → Add binding** bölümüne girin.
3. Tür olarak **KV Namespace** seçin.
4. Yeni bir KV alanı oluşturun.
5. Binding/Variable name değerini tam olarak `NEWS_STATE` yapın.
6. Kaydedip Worker'ı yeniden dağıtın.

## Cron görünmüyorsa

İlk dağıtımdan yaklaşık 15 dakika sonra hâlâ görünmüyorsa Worker içinde **Settings → Triggers → Cron Triggers** bölümünü kontrol edin. Gerekirse aşağıdaki ifadeyi ekleyin:

```text
*/5 * * * *
```

## Geniş filtre sistemi

Filtre özellikle geniş tutulur. Aşağıdaki içerikler kabul edilir:

- AI şirketleri ve modelleri: OpenAI, ChatGPT, Claude, Gemini, Llama, DeepSeek, Qwen, Kimi, GLM, Midjourney, Perplexity ve çok daha fazlası
- Önemli kişiler: Sam Altman, Jensen Huang, Demis Hassabis, Dario Amodei, Ilya Sutskever, Mira Murati, Liang Wenfeng ve diğer AI liderleri
- Yazılım: Windows, Linux, Android, iOS, uygulamalar, geliştirici araçları, açık kaynak, veritabanları ve bulut
- Siber güvenlik: saldırılar, açıklar, veri sızıntıları, zararlı yazılımlar ve gizlilik
- Donanım ve tüketici teknolojisi: işlemci, GPU, telefon, tablet, bilgisayar, oyun donanımı, giyilebilir cihaz ve ağ teknolojileri
- Gelecek teknolojileri: robotik, otonom sürüş, kuantum, uzay, biyoteknoloji, enerji ve batarya teknolojileri

Başlıkta güçlü bir eşleşme 5 puan, açıklamada güçlü eşleşme 3 puan, yardımcı eşleşme 1 puan alır. Açıkça film–dizi, magazin, spor, market kataloğu veya genel gündem olan ve güçlü teknoloji sinyali taşımayan içerikler elenir.

Anahtar kelimeler ve puanlama kuralları [`src/filter.js`](src/filter.js) dosyasındadır.
## Yerel geliştirme

İsteğe bağlı olarak projeyi bilgisayarınızda test etmek için:

```powershell
npm install
npm test
npm run dev
```

Yerel webhook testi için `.dev.vars` dosyası oluşturun:

```text
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

`.dev.vars` dosyası Git tarafından yok sayılır ve depoya gönderilmez.
