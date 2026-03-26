![jsvelox](https://raw.githubusercontent.com/yunus6141/jsvelox/main/logo.png)

# jsvelox 🦓
> **Codename: Quagga — v2.1.0**

[![npm version](https://img.shields.io/npm/v/jsvelox.svg)](https://www.npmjs.com/package/jsvelox)
[![npm downloads](https://img.shields.io/npm/dm/jsvelox.svg)](https://www.npmjs.com/package/jsvelox)
[![GitHub](https://img.shields.io/badge/GitHub-yunus6141%2Fjsvelox-green)](https://github.com/yunus6141/jsvelox)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## Neden jsvelox?

AI agent platformları güçlüdür ama ağırdır. Her kullanılmayan node bile kaynak tüketir.

**jsvelox farklı çalışır** — sadece kullandığın kadar kaynak harca. Sunucu kurma, karmaşık pipeline'lar oluşturma. Birkaç satır JavaScript ile yapay zekayı projenize entegre edin.

- ✅ Sunucu gerekmez
- ✅ Minimum kaynak kullanımı  
- ✅ Claude, OpenAI ve Gemini tek kütüphanede
- ✅ Yapay zekayı kendi verinizle eğitin
- ✅ Tek satır UI entegrasyonu (`onSend`)
- ✅ TypeScript desteği ve otomatik tamamlama

---

## Kurulum
```bash
npm install jsvelox
```

---

## Zorunlu Kodlar — Her projede bunları yazacaksınız
```js
import VeloxAI from 'jsvelox'

const ai = new VeloxAI({
  provider: 'BURAYA-AI-SAGLAYICI-GELECEK', // 'claude' | 'openai' | 'gemini'
  apiKey: 'BURAYA-API-KEY-GELECEK',        // AI sağlayıcınızdan aldığınız key
  memoryLimit: 10,   // Son kaç mesaj hafızada tutulsun? (opsiyonel)
  timeout: 15000     // Kaç ms içinde cevap gelmezse hata versin? (opsiyonel)
})

// Mesaj gönder, cevap al
const cevap = await ai.send('Merhaba!')
console.log(cevap)
```

---

## Yapay Zekayı Eğitme — Sitenize özel asistan yapın

Bir e-ticaret sitesi, sağlık mağazası veya herhangi bir işletme için yapay zekayı kendi ürün ve bilgilerinizle eğitebilirsiniz:
```js
import VeloxAI from 'jsvelox'

const ai = new VeloxAI({
  provider: 'gemini',
  apiKey: 'BURAYA-API-KEY-GELECEK',

  // Yapay zekaya karakter ve görev tanımlayın
  systemPrompt: 'Sen VitaShop\'un sağlık asistanısın. Müşterilerin sorularını Türkçe cevapla. Sağlık durumlarına göre uygun ürün öner.',

  // Hangi bilgileri öğreteceğinizi tanımlayın
  contextFields: ['urun', 'kategori', 'fiyat', 'fayda'],

  // Yapay zekanın öğreneceği veriler
  context: [
    { urun: 'Omega-3 Balık Yağı', kategori: 'Kalp Sağlığı', fiyat: '289 TL', fayda: 'Kalp, beyin ve eklem sağlığını destekler' },
    { urun: 'C Vitamini 1000mg', kategori: 'Bağışıklık', fiyat: '159 TL', fayda: 'Antioksidan etki, bağışıklık güçlendirir' },
    { urun: 'Magnezyum Kompleks', kategori: 'Sinir Sistemi', fiyat: '219 TL', fayda: 'Kas krampları ve uyku kalitesi için' }
  ],

  memoryLimit: 10,
  timeout: 15000
})

const cevap = await ai.send('Kalp hastasıyım, bana ne önerirsiniz?')
console.log(cevap)
```

---

## Tek Satır Entegrasyon — onSend

HTML'inizde buton, input ve cevap alanı varsa tek satırda bağlayabilirsiniz:
```html
<input id="userInput" type="text" placeholder="Mesajınızı yazın...">
<button id="sendBtn">Gönder</button>
<p id="cevap"></p>
```
```js
ai.onSend('#sendBtn', '#userInput', '#cevap')
```

Bu tek satır şunları otomatik yapar:
- Butona tıklanınca mesajı yapay zekaya gönderir
- Enter tuşu da çalışır
- Cevap gelene kadar "Yazıyor..." gösterir
- Cevap gelince `#cevap` alanına yazar
- Hata olursa hata mesajını gösterir

---

## Opsiyonel Metodlar
```js
// Konuşma geçmişini görüntüle
console.log(ai.getMemory())

// Konuşma geçmişini temizle — yeni konuşma başlatmak için
ai.clearMemory()

// Hata olursa otomatik tekrar dene (varsayılan 3 kez, 1 saniye arayla)
await ai.sendWithRetry('Merhaba!', 3)
```

---

## Tüm Ayarlar

| Ayar | Zorunlu | Varsayılan | Açıklama |
|------|---------|------------|----------|
| `provider` | ✅ | — | `claude` / `openai` / `gemini` |
| `apiKey` | ✅ | — | AI sağlayıcınızdan alınan key |
| `model` | — | otomatik | Özel model adı |
| `memoryLimit` | — | sınırsız | Kaç mesaj hatırlansın |
| `timeout` | — | 30000ms | Zaman aşımı süresi |
| `systemPrompt` | — | — | Yapay zekaya karakter tanımlama |
| `contextFields` | — | — | Veri alan isimleri |
| `context` | — | — | Yapay zekanın öğreneceği veriler |

---

## Metodlar

| Metod | Açıklama |
|-------|----------|
| `send(message)` | Mesaj gönder, cevap al |
| `sendWithRetry(message, retries)` | Hata olursa otomatik tekrar dene |
| `onSend(btnId, inputId, responseId)` | Tek satır UI bağlama |
| `getMemory()` | Konuşma geçmişini görüntüle |
| `clearMemory()` | Konuşma geçmişini temizle |

---

## AI Sağlayıcıları

| Sağlayıcı | Kod | Ücretsiz API |
|-----------|-----|--------------|
| Anthropic Claude | `claude` | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI GPT | `openai` | [platform.openai.com](https://platform.openai.com) |
| Google Gemini | `gemini` | [aistudio.google.com](https://aistudio.google.com) |

---

## GitHub

📦 [github.com/yunus6141/jsvelox](https://github.com/yunus6141/jsvelox)

---

*jsvelox — Quagga 🦓 — MIT License — Made with ❤️ by Yunus Emre Sancak*