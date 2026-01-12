import { Message } from './types'

export const buildMessages = (
  systemMessage: string,
  userInput: string,
  assistantMessages: Message[],
): Message[] => {
  const messages: Message[] = []
  if (systemMessage) {
    messages.push({ role: 'system', content: systemMessage })
  }
  for (const msg of assistantMessages) {
    if (msg.role && msg.content) {
      messages.push(msg)
    }
  }
  if (userInput) {
    messages.push({ role: 'user', content: userInput })
  }
  return messages
}
