import { ExecuteContext, Message } from './types'

export const getMemoryMessages = async (
  ctx: ExecuteContext,
): Promise<Message[]> => {
  try {
    const memory = await ctx.getInputConnectionData('ai_memory', 0)
    if (!memory) {
      return []
    }

    const memoryInstance = Array.isArray(memory) ? memory[0] : memory

    if (
      memoryInstance &&
      typeof memoryInstance === 'object' &&
      'chatHistory' in memoryInstance
    ) {
      const chatHistory = memoryInstance.chatHistory
      if (chatHistory && typeof chatHistory.getMessages === 'function') {
        const messages = await chatHistory.getMessages()
        return messages.map(
          (msg: { _getType?: () => string; content?: string }) => ({
            role:
              msg._getType?.() === 'human'
                ? 'user'
                : msg._getType?.() === 'ai'
                  ? 'assistant'
                  : 'user',
            content: msg.content || '',
          }),
        )
      }
    }

    return []
  } catch {
    return []
  }
}

export const saveToMemory = async (
  ctx: ExecuteContext,
  userMessage: string,
  assistantMessage: string,
): Promise<void> => {
  try {
    const memory = await ctx.getInputConnectionData('ai_memory', 0)
    if (!memory) {
      return
    }

    const memoryInstance = Array.isArray(memory) ? memory[0] : memory

    if (
      memoryInstance &&
      typeof memoryInstance === 'object' &&
      'chatHistory' in memoryInstance
    ) {
      const chatHistory = memoryInstance.chatHistory
      if (chatHistory && typeof chatHistory.addMessages === 'function') {
        const { HumanMessage, AIMessage } =
          await import('@langchain/core/messages')
        await chatHistory.addMessages([
          new HumanMessage(userMessage),
          new AIMessage(assistantMessage),
        ])
      }
    }
  } catch {
    // Ignore memory save errors
  }
}
