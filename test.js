// -------------------------------V1.8 VE ÖNCESİ İÇİNDİR--------------------------------
// import { VeloxAI } from './src/index.js'

// const ai = new VeloxAI({
//   provider: 'claude',
//   apiKey: 'BURAYA-API-KEY-GELECEK'
// })

// const cevap = await ai.send('merhaba')
// console.log(cevap)

//----------------------------------------V1.9 VE SONRASI İÇİNDİR-----------------------
// import { VeloxAI } from './src/index.js'

// const ai = new VeloxAI({
//   provider: 'gemini',
//   apiKey: 'BURAYA-API-KEY-GELECEK',
//   memoryLimit: 10,
//   timeout: 15000
// })

// // Mesaj gönder
// const cevap = await ai.send('merhaba')
// console.log('Cevap:', cevap)

// // Memory görüntüle
// console.log('Memory:', ai.getMemory())

// // Memory temizle
// ai.clearMemory()
// console.log('Memory temizlendi:', ai.getMemory())

// ============================================================
// jsvelox Test Dosyası — v2.1.0 (Quagga)
// ============================================================

import VeloxAI from './src/index.js'

// ── TEMEL KULLANIM ──────────────────────────────────────────
const ai = new VeloxAI({
  provider: 'gemini',          // 'claude' | 'openai' | 'gemini'
  apiKey: 'BURAYA-API-KEY-GELECEK',
  memoryLimit: 10,             // son 10 mesajı hatırlar
  timeout: 15000               // 15 saniye içinde cevap gelmezse hata ver
})

// Mesaj gönder
const cevap = await ai.send('merhaba')
console.log('Cevap:', cevap)

// Memory görüntüle
console.log('Memory:', ai.getMemory())

// Memory temizle
ai.clearMemory()
console.log('Memory temizlendi:', ai.getMemory())

// ── AI EĞİTİMİ ──────────────────────────────────────────────
const aiEgitimli = new VeloxAI({
  provider: 'gemini',
  apiKey: 'BURAYA-API-KEY-GELECEK',
  systemPrompt: 'Sen VitaShop\'un sağlık asistanısın. Ürünler hakkında Türkçe cevap ver.',
  context: [
    { urun: 'Omega-3', fiyat: '289 TL', fayda: 'Kalp sağlığı' },
    { urun: 'C Vitamini', fiyat: '159 TL', fayda: 'Bağışıklık' }
  ],
  memoryLimit: 10,
  timeout: 15000
})

const cevap2 = await aiEgitimli.send('Omega-3 ne kadar?')
console.log('Eğitimli AI Cevap:', cevap2)

// ── TEK SATIR ENTEGRASYON ────────────────────────────────────
// ai.onSend('#sendButton', '#userInput', '#response')
// Bu tek satır butonu, inputu ve cevap alanını otomatik bağlar