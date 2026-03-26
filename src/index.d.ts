export interface VeloxConfig {
  provider: 'claude' | 'openai' | 'gemini'
  apiKey: string
  model?: string
  memoryLimit?: number
  timeout?: number
  systemPrompt?: string
  contextFields?: string[]
  context?: Record<string, any>[]
}

export class VeloxAI {
  constructor(config: VeloxConfig)
  send(message: string): Promise<string>
  sendWithRetry(message: string, retries?: number): Promise<string>
  clearMemory(): void
  getMemory(): Array<{ role: string; content: string }>
  onSend(buttonId: string, inputId: string, responseId: string): void
}

export default VeloxAI