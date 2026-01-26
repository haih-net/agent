import { ExecuteContext, Message } from './types'

interface MemoryInstance {
  loadMemoryVariables: (
    values: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>
  saveContext: (
    inputValues: Record<string, unknown>,
    outputValues: Record<string, unknown>,
  ) => Promise<void>
}

interface LangChainMessage {
  _getType?: () => string
  content?: string | unknown
}

export const getMemoryMessages = async (
  ctx: ExecuteContext,
): Promise<Message[]> => {
  const memory = await ctx.getInputConnectionData('ai_memory', 0)
  if (!memory) {
    return []
  }

  const memoryInstance = (
    Array.isArray(memory) ? memory[0] : memory
  ) as MemoryInstance

  if (
    memoryInstance &&
    typeof memoryInstance === 'object' &&
    typeof memoryInstance.loadMemoryVariables === 'function'
  ) {
    const memoryVariables = await memoryInstance.loadMemoryVariables({})
    const chatHistory =
      (memoryVariables['chat_history'] as LangChainMessage[]) || []

    return chatHistory.map((msg) => ({
      role:
        msg._getType?.() === 'human'
          ? 'user'
          : msg._getType?.() === 'ai'
            ? 'assistant'
            : 'user',
      content: (msg.content as string) || '',
    }))
  }

  return []
}

export const saveToMemory = async (
  ctx: ExecuteContext,
  userMessage: string,
  assistantMessage: string,
): Promise<void> => {
  try {
    const memory = await ctx.getInputConnectionData('ai_memory', 0)
    if (!memory || !assistantMessage) {
      return
    }

    const memoryInstance = (
      Array.isArray(memory) ? memory[0] : memory
    ) as MemoryInstance

    if (
      memoryInstance &&
      typeof memoryInstance === 'object' &&
      typeof memoryInstance.saveContext === 'function'
    ) {
      await memoryInstance.saveContext(
        { input: userMessage },
        { output: assistantMessage },
      )
    }
  } catch (error) {
    console.error('[AgentOrchestrator] saveToMemory error:', error)
  }
}
