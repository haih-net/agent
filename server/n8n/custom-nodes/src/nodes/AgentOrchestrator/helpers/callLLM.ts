import { ChatModel, ExecuteContext, LLMResponse, Message } from './types'

const callLLMStreaming = async (
  ctx: ExecuteContext,
  chatModel: ChatModel,
  messages: Message[],
  options: Record<string, unknown>,
): Promise<LLMResponse> => {
  let content = ''
  let toolCalls: LLMResponse['tool_calls'] = []

  try {
    const stream = await chatModel.stream!(messages, options)

    for await (const chunk of stream) {
      if (chunk.content) {
        content += chunk.content
        ctx.sendChunk('item', 0, chunk.content)
      }

      if (chunk.tool_calls) {
        toolCalls = chunk.tool_calls
      }
    }
  } catch {
    const result = await chatModel.invoke!(messages, options)
    content = result.content || ''
    toolCalls = result.tool_calls || []
  }

  return {
    content,
    tool_calls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
  }
}

export const callLLM = async (
  ctx: ExecuteContext,
  messages: Message[],
  tools: Record<string, unknown>[],
  toolChoice: string,
  streaming: boolean,
): Promise<LLMResponse> => {
  try {
    const chatModel = (await ctx.getInputConnectionData(
      'ai_languageModel',
      0,
    )) as ChatModel

    if (!chatModel) {
      throw new Error(
        'No Chat Model connected. Please connect a Chat Model to the node.',
      )
    }

    const options: Record<string, unknown> = {}
    if (tools && tools.length > 0) {
      options.tools = tools
      options.tool_choice = toolChoice
    }

    let response: LLMResponse
    if (streaming && chatModel.stream) {
      response = await callLLMStreaming(ctx, chatModel, messages, options)
    } else if (chatModel.invoke) {
      const result = await chatModel.invoke(messages, options)
      response = {
        content: result.content || '',
        tool_calls: result.tool_calls || undefined,
      }
    } else {
      throw new Error('Connected Chat Model does not support invoke method')
    }

    return response
  } catch (e: unknown) {
    throw new Error(`LLM Error: ${(e as Error).message}`)
  }
}
