# jsvelox 🦤
**V1 Codename: Dodo | V2 Codename: Quagga**

Lightweight JavaScript library for AI integration. Connect Claude, OpenAI and Gemini with just a few lines of code. Train your AI with custom data and system prompts.

## Install
```bash
npm install jsvelox
```

## Basic Usage
```js
import { VeloxAI } from 'jsvelox'

const ai = new VeloxAI({
  provider: 'gemini',
  apiKey: 'your-api-key',
  memoryLimit: 10,
  timeout: 15000
})

const reply = await ai.send('Hello!')
console.log(reply)
```

## AI Training (V2)
```js
const ai = new VeloxAI({
  provider: 'gemini',
  apiKey: 'your-api-key',
  systemPrompt: 'You are LORA Textile assistant. Only answer about fabrics.',
  contextFields: ['name', 'price', 'color', 'size'],
  context: [
    { name: 'Linen Pants', price: '450 TL', color: 'Beige', size: 'S/M/L' },
    { name: 'Silk Blouse', price: '890 TL', color: 'Cream', size: 'XS/S/M' }
  ]
})
```

## Providers
- `claude` — Anthropic Claude
- `openai` — OpenAI GPT
- `gemini` — Google Gemini

## Methods
- `send(message)` — Send a message
- `sendWithRetry(message, retries)` — Send with auto retry
- `getMemory()` — Get conversation history
- `clearMemory()` — Clear conversation history

## Config Options
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| provider | string | — | claude / openai / gemini |
| apiKey | string | — | Your API key |
| model | string | null | Custom model name |
| memoryLimit | number | null | Max messages to remember |
| timeout | number | 30000 | Timeout in ms |
| systemPrompt | string | null | AI personality/role |
| contextFields | array | [] | Data field names |
| context | array | [] | Your data |