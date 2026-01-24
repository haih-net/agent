import { ExecuteContext } from './types'

const IS_DEVELOPMENT =
  process.env.NODE_ENV !== 'production' &&
  process.env.N8N_DEBUG_AGENTS === 'true'

export const debugLog = (
  ctx: ExecuteContext,
  isStreamingAvailable: boolean,
  message: string | unknown,
): void => {
  if (IS_DEVELOPMENT && isStreamingAvailable) {
    const text = typeof message === 'string' ? message : JSON.stringify(message)
    ctx.sendChunk('item', 0, `\n[DEBUG] ${text}\n`)
  }
}
