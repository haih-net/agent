export const CHAT_SESSION_STORAGE_KEY = 'chat_session_id'

export type ChatMessage = {
  id: string
  text: string
  isUser: boolean
}
