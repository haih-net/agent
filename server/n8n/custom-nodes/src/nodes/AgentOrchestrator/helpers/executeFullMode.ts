import { INodeExecutionData } from 'n8n-workflow'
import { ExecuteContext, Message, ToolCall } from './types'
import { parseJson } from './parseJson'
import { buildMessages } from './buildMessages'
import { getConnectedTools } from './getConnectedTools'
import { extractToolCalls } from './extractToolCalls'
import { callLLM } from './callLLM'
import { executeTool } from './executeTool'
import { getMemoryMessages, saveToMemory } from './getMemoryMessages'

interface AgentOptions {
  systemMessage?: string
  maxIterations?: number
  enableStreaming?: boolean
  showToolCalls?: boolean
  toolChoice?: string
  assistantMessages?: string
}

const IS_DEVELOPMENT =
  process.env.NODE_ENV !== 'production' &&
  process.env.N8N_DEBUG_AGENTS === 'true'

const debugLog = (
  ctx: ExecuteContext,
  isStreamingAvailable: boolean,
  message: string,
) => {
  if (IS_DEVELOPMENT && isStreamingAvailable) {
    ctx.sendChunk('item', 0, `\n[DEBUG] ${message}\n`)
  }
}

interface OpenRouterCredentials {
  apiKey: string
  url: string
}

export const executeFullMode = async (
  ctx: ExecuteContext,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[][]> => {
  const credentials = (await ctx.getCredentials(
    'openRouterApi',
  )) as unknown as OpenRouterCredentials
  const model = ctx.getNodeParameter(
    'model',
    0,
    'anthropic/claude-sonnet-4',
  ) as string
  const options = ctx.getNodeParameter('options', 0, {}) as AgentOptions
  const systemMessage = options.systemMessage || ''
  const assistantMessagesJson = options.assistantMessages || '[]'
  const maxIterations = options.maxIterations ?? 10
  const enableStreaming = options.enableStreaming ?? true
  const showToolCalls = options.showToolCalls ?? true
  const toolChoice = options.toolChoice || 'auto'

  const userInput = (items[0]?.json?.chatInput as string) || ''
  if (!userInput) {
    throw new Error('chatInput is required but was empty or not provided')
  }

  const user = items[0]?.json?.user as
    | { id: string; username?: string; fullname?: string }
    | null
    | undefined
  const sessionId = (items[0]?.json?.sessionId as string) || ''

  const tools = await getConnectedTools(ctx)
  const assistantMessages = parseJson<Message[]>(assistantMessagesJson, [])
  const memoryMessages = await getMemoryMessages(ctx)

  const isStreamingAvailable =
    enableStreaming &&
    typeof ctx.isStreaming === 'function' &&
    ctx.isStreaming()

  if (isStreamingAvailable) {
    ctx.sendChunk('begin', 0)
  }

  debugLog(
    ctx,
    isStreamingAvailable,
    `Starting agent loop. Tools available: ${tools.length}, toolChoice: ${toolChoice}`,
  )
  debugLog(
    ctx,
    isStreamingAvailable,
    `Tools: ${tools.map((t) => (t as { function?: { name?: string } }).function?.name || 'unknown').join(', ')}`,
  )

  const messages = buildMessages(
    systemMessage,
    userInput,
    [...memoryMessages, ...assistantMessages],
    { user, sessionId },
  )
  let iterations = 0
  let finalOutput = ''
  const allToolCalls: ToolCall[] = []

  while (iterations < maxIterations) {
    iterations++
    debugLog(
      ctx,
      isStreamingAvailable,
      `Iteration ${iterations}/${maxIterations}`,
    )

    const response = await callLLM({
      ctx,
      credentials,
      model,
      messages,
      tools,
      toolChoice,
      streaming: isStreamingAvailable,
    })

    debugLog(
      ctx,
      isStreamingAvailable,
      `LLM response received. Content length: ${response.content?.length || 0}, thinking length: ${response.thinking?.length || 0}, tool_calls: ${response.tool_calls?.length || 0}`,
    )

    if (response.thinking) {
      debugLog(ctx, isStreamingAvailable, `[THINKING] ${response.thinking}`)
    }

    if (response.content) {
      finalOutput += response.content
    }

    const toolCalls = extractToolCalls(response)
    debugLog(
      ctx,
      isStreamingAvailable,
      `Extracted tool calls: ${toolCalls?.length || 0}`,
    )

    if (!toolCalls || toolCalls.length === 0) {
      debugLog(ctx, isStreamingAvailable, `No tool calls, breaking loop`)
      break
    }

    allToolCalls.push(...toolCalls)

    if (isStreamingAvailable && showToolCalls) {
      for (const tc of toolCalls) {
        const toolDisplayName = tc.name.replace(/_/g, ' ').replace(/ Tool$/, '')
        ctx.sendChunk('item', 0, `\n\n⏳ *Calling ${toolDisplayName}...*\n\n`)
      }
    }

    messages.push({
      role: 'assistant',
      content: response.content || null,
      tool_calls: response.tool_calls,
    })

    for (const tc of toolCalls) {
      debugLog(
        ctx,
        isStreamingAvailable,
        `Executing tool: ${tc.name} with args: ${JSON.stringify(tc.arguments)}`,
      )
      const toolDebugLog = (msg: string) =>
        debugLog(ctx, isStreamingAvailable, msg)
      const toolResult = await executeTool(ctx, tc, toolDebugLog)
      debugLog(
        ctx,
        isStreamingAvailable,
        `Tool ${tc.name} result: ${typeof toolResult === 'string' ? toolResult.substring(0, 200) : JSON.stringify(toolResult).substring(0, 200)}`,
      )
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content:
          typeof toolResult === 'string'
            ? toolResult
            : JSON.stringify(toolResult),
      })
    }
  }

  debugLog(
    ctx,
    isStreamingAvailable,
    `Agent loop finished. Total iterations: ${iterations}, total tool calls: ${allToolCalls.length}, output length: ${finalOutput.length}`,
  )

  if (isStreamingAvailable) {
    ctx.sendChunk('end', 0)
  }

  await saveToMemory(ctx, userInput, finalOutput)

  return [
    items.map((item) => ({
      json: {
        ...item.json,
        output: finalOutput,
        toolCalls: allToolCalls,
        iterations,
        mode: 'full',
      },
    })),
  ]
}
