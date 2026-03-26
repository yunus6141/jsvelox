export class VeloxAI {
  // TR: Kütüphaneyi başlatır. API key, provider (claude/openai/gemini), model ve timeout ayarlarını alır.
  // Eksik bilgi girilirse hata fırlatır.
  // EN: Initializes the library. Takes API key, provider (claude/openai/gemini), model and timeout settings.
  // Throws an error if required fields are missing.
  constructor(config) {
    if (!config.apiKey) {
      throw new Error('API key zorunlu!')
    }
    if (!config.provider) {
      throw new Error('Provider zorunlu! claude, openai veya gemini kullan.')
    }
    this.provider = config.provider.toLowerCase().trim()
    this.apiKey = config.apiKey.trim()
    this.model = config.model ? config.model.trim() : null
    this.memory = []
    this.memoryLimit = config.memoryLimit || null
    this.systemPrompt = config.systemPrompt || null
    this.contextFields = config.contextFields || []
    this.context = config.context || []
    this.timeout = typeof config.timeout === 'number' && config.timeout > 0
      ? config.timeout
      : 30000
  }

  // TR: Kullanıcının mesajını seçili yapay zekaya gönderir ve cevabı döndürür.
  // EN: Sends the user's message to the selected AI and returns the response.
  async send(message) {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error('Mesaj boş olamaz!')
    }

    if (this.memory.length === 0 && (this.systemPrompt || this.context.length > 0)) {
      let hazirlik = ''
      if (this.systemPrompt) {
        hazirlik += this.systemPrompt + '\n\n'
      }
      if (this.context.length > 0) {
        hazirlik += 'Ürün/İçerik Bilgileri:\n'
        this.context.forEach(item => {
          hazirlik += Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ') + '\n'
        })
      }
      this.memory.push({ role: 'user', content: hazirlik })
      this.memory.push({ role: 'assistant', content: 'Anladım, size yardımcı olmaya hazırım.' })
    }

    this.memory.push({ role: 'user', content: message })

    if (this.memoryLimit && this.memory.length > this.memoryLimit) {
      this.memory = this.memory.slice(-this.memoryLimit)
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Zaman aşımı! AI cevap vermedi.')), this.timeout)
    )

    let cevap
    try {
      if (this.provider === 'claude') {
        cevap = await Promise.race([this._sendClaude(this.memory), timeoutPromise])
      } else if (this.provider === 'openai') {
        cevap = await Promise.race([this._sendOpenAI(this.memory), timeoutPromise])
      } else if (this.provider === 'gemini') {
        cevap = await Promise.race([this._sendGemini(this.memory), timeoutPromise])
      } else {
        throw new Error('Geçersiz provider. claude, openai veya gemini kullan.')
      }
    } catch (err) {
      this.memory.pop()
      throw err
    }

    this.memory.push({ role: 'assistant', content: cevap })
    return cevap
  }

  // TR: Mesajı gönderir, hata olursa belirtilen sayıda tekrar dener (varsayılan 3 kez).
  // EN: Sends the message and retries on failure up to the specified number of times (default 3).
  async sendWithRetry(message, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.send(message)
      } catch (err) {
        this.memory.pop()
        if (i === retries - 1) throw err
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }

  // TR: Konuşma geçmişini temizler.
  // EN: Clears the conversation history.
  clearMemory() {
    this.memory = []
  }

  // TR: Mevcut konuşma geçmişini döndürür.
  // EN: Returns the current conversation history.
  getMemory() {
    return this.memory
  }

  // TR: Buton, input ve cevap alanını otomatik bağlar. Tek satırda entegrasyon sağlar.
  // EN: Automatically binds button, input and response area. Single line integration.
  onSend(buttonId, inputId, responseId) {
    const btn = document.querySelector(buttonId)
    const input = document.querySelector(inputId)
    const response = document.querySelector(responseId)

    if (!btn || !input || !response) {
      throw new Error('onSend: Belirtilen elementler bulunamadı!')
    }

    const handler = async () => {
      const mesaj = input.value.trim()
      if (!mesaj) return
      response.innerText = 'Yazıyor...'
      btn.disabled = true
      try {
        const cevap = await this.send(mesaj)
        response.innerText = cevap
        input.value = ''
      } catch (err) {
        response.innerText = 'Hata: ' + err.message
      } finally {
        btn.disabled = false
      }
    }

    btn.addEventListener('click', handler)
    input.addEventListener('keypress', e => { if (e.key === 'Enter') handler() })
  }

  async _sendClaude(memory) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: memory
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Claude hata: ${data.error?.message || 'Bilinmeyen hata'}`)
    }
    return data.content[0].text
  }

  async _sendOpenAI(memory) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o-mini',
        messages: memory
      })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`OpenAI hata: ${data.error?.message || 'Bilinmeyen hata'}`)
    }
    return data.choices[0].message.content
  }

  async _sendGemini(memory) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`
    const contents = memory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(`Gemini hata: ${data.error?.message || 'Bilinmeyen hata'}`)
    }
    return data.candidates[0].content.parts[0].text
  }
}

export default VeloxAI