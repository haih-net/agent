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

export const executeFullMode = async (
  ctx: ExecuteContext,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[][]> => {
  const options = ctx.getNodeParameter('options', 0, {}) as AgentOptions
  const systemMessage = options.systemMessage || ''
  const assistantMessagesJson = options.assistantMessages || '[]'
  const maxIterations = options.maxIterations ?? 10
  const enableStreaming = options.enableStreaming ?? true
  const showToolCalls = options.showToolCalls ?? true
  const toolChoice = options.toolChoice || 'auto'

  const userInput = (items[0]?.json?.chatInput as string) || ''
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

  const messages = buildMessages(systemMessage, userInput, [
    ...memoryMessages,
    ...assistantMessages,
  ])
  let iterations = 0
  let finalOutput = ''
  const allToolCalls: ToolCall[] = []

  while (iterations < maxIterations) {
    iterations++

    const response = await callLLM(
      ctx,
      messages,
      tools,
      toolChoice,
      isStreamingAvailable,
    )

    if (response.content) {
      finalOutput += response.content
    }

    const toolCalls = extractToolCalls(response)

    if (!toolCalls || toolCalls.length === 0) {
      break
    }

    allToolCalls.push(...toolCalls)

    if (isStreamingAvailable && showToolCalls) {
      for (const tc of toolCalls) {
        ctx.sendChunk('item', 0, `\n🔧 Calling: ${tc.name}...\n`)
      }
    }

    messages.push({
      role: 'assistant',
      content: response.content || null,
      tool_calls: response.tool_calls,
    })

    for (const tc of toolCalls) {
      const toolResult = await executeTool(ctx, tc)
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
