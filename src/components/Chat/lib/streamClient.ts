const CHAT_WEBHOOK_URL = '/webhook/agent-chat-webhook/chat'

type StreamChunk = {
  type: 'begin' | 'item' | 'end'
  content?: string
  metadata?: {
    nodeId: string
    nodeName: string
    itemIndex: number
    runIndex: number
    timestamp: number
  }
}

export type StreamCallbacks = {
  onChunk: (text: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

function parseStreamChunks(data: string): StreamChunk[] {
  const chunks: StreamChunk[] = []
  const lines = data.split('\n').filter((line) => line.trim())

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as StreamChunk
      chunks.push(parsed)
    } catch {
      // incomplete JSON, skip
    }
  }

  return chunks
}

export async function sendMessageStream(
  message: string,
  sessionId: string,
  callbacks: StreamCallbacks,
  abortSignal?: AbortSignal,
): Promise<void> {
  const { onChunk, onDone, onError } = callbacks

  try {
    const response = await fetch(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId,
        token: localStorage.getItem('token'),
      }),
      signal: abortSignal,
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    for (;;) {
      const { done, value } = await reader.read()

      if (done) {
        if (buffer.trim()) {
          const chunks = parseStreamChunks(buffer)
          for (const chunk of chunks) {
            if (chunk.type === 'item' && chunk.content) {
              onChunk(chunk.content)
            }
          }
        }
        onDone()
        break
      }

      buffer += decoder.decode(value, { stream: true })

      const lastNewline = buffer.lastIndexOf('\n')
      if (lastNewline !== -1) {
        const complete = buffer.slice(0, lastNewline + 1)
        buffer = buffer.slice(lastNewline + 1)

        const chunks = parseStreamChunks(complete)
        for (const chunk of chunks) {
          if (chunk.type === 'item' && chunk.content) {
            onChunk(chunk.content)
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)))
  }
}
