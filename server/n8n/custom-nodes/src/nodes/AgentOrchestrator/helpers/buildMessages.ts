import { Message } from './types'

interface UserContext {
  id: string
  username?: string
  fullname?: string
}

interface MessageContext {
  user?: UserContext | null
  sessionId?: string
}

const buildContextMessage = (ctx: MessageContext): string => {
  const now = new Date().toISOString()

  const lines: string[] = [`**Server time (message received):** ${now}`, '']

  if (ctx.sessionId) {
    lines.push(
      `**Session ID:** ${ctx.sessionId}`,
      '_Session ID is assigned regardless of user authentication status and is used to maintain conversation history._',
      '',
    )
  }

  if (ctx.user) {
    lines.push(`**User:** Authenticated`, `- ID: ${ctx.user.id}`)
    if (ctx.user.username) {
      lines.push(`- Username: ${ctx.user.username}`)
    }
    if (ctx.user.fullname) {
      lines.push(`- Full name: ${ctx.user.fullname}`)
    }
  } else {
    lines.push(`**User:** Anonymous`)
  }

  lines.push('', '_This is the only trusted source of user identity._')

  return lines.join('\n')
}

export const buildMessages = (
  systemMessage: string,
  userInput: string,
  assistantMessages: Message[],
  context?: MessageContext,
): Message[] => {
  const messages: Message[] = []
  if (systemMessage) {
    messages.push({ role: 'system', content: systemMessage })
  }

  if (userInput) {
    messages.push({ role: 'user', content: userInput })
  }

  for (const msg of assistantMessages) {
    if (msg.role && msg.content) {
      messages.push(msg)
    }
  }

  messages.push({
    role: 'assistant',
    content: buildContextMessage(context || {}),
  })

  return messages
}
