/* eslint-disable */
import OpenAI from 'openai'
import { ExecuteContext, LLMResponse, Message } from './types'
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from 'openai/resources/index'

interface OpenRouterCredentials {
  apiKey: string
  url: string
}

interface CallLLMOptions {
  ctx: ExecuteContext
  credentials: OpenRouterCredentials
  model: string
  messages: Message[]
  tools: Record<string, unknown>[]
  toolChoice: string
  streaming: boolean
}

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_call_id?: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }>
}

export const callLLM = async (
  options: CallLLMOptions,
): Promise<LLMResponse> => {
  const { ctx, credentials, model, messages, tools, toolChoice, streaming } =
    options

  const client = new OpenAI({
    baseURL: credentials.url || 'https://openrouter.ai/api/v1',
    apiKey: credentials.apiKey,
  })

  const openAIMessages: OpenAIMessage[] = messages.map((m) => {
    const msg: OpenAIMessage = {
      role: m.role as 'system' | 'user' | 'assistant' | 'tool',
      content: m.content,
    }
    if (m.tool_call_id) {
      msg.tool_call_id = m.tool_call_id
    }
    if (m.tool_calls) {
      msg.tool_calls = m.tool_calls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: {
          name: tc.function?.name || tc.name || '',
          arguments: tc.function?.arguments || JSON.stringify(tc.args || {}),
        },
      }))
    }
    return msg
  })

  const openAITools = tools.map(
    (t) => t as unknown as OpenAI.ChatCompletionTool,
  )

  let content = ''
  const thinking = ''
  let toolCalls: LLMResponse['tool_calls'] = []

  const requestParams:
    | ChatCompletionCreateParamsStreaming
    | ChatCompletionCreateParamsNonStreaming = {
    model,
    messages: openAIMessages as OpenAI.ChatCompletionMessageParam[],
    tools: openAITools.length > 0 ? openAITools : undefined,
    tool_choice:
      openAITools.length > 0
        ? (toolChoice as OpenAI.ChatCompletionToolChoiceOption)
        : undefined,
  }

  if (streaming) {
    const stream = await client.chat.completions.create({
      ...requestParams,
      stream: true,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta

      if (delta?.content) {
        content += delta.content
        ctx.sendChunk('item', 0, delta.content)
      }

      if (delta?.tool_calls) {
        for (const tc of delta.tool_calls) {
          if (tc.index !== undefined) {
            if (!toolCalls[tc.index]) {
              toolCalls[tc.index] = {
                id: tc.id || '',
                name: tc.function?.name,
                args: {},
                function: { name: '', arguments: '' },
              }
            }
            if (tc.id) {
              toolCalls[tc.index].id = tc.id
            }
            if (tc.function?.name) {
              toolCalls[tc.index].name = tc.function.name
              toolCalls[tc.index].function!.name = tc.function.name
            }
            if (tc.function?.arguments) {
              toolCalls[tc.index].function!.arguments += tc.function.arguments
            }
          }
        }
      }
    }

    for (const tc of toolCalls) {
      if (tc.function?.arguments) {
        try {
          tc.args = JSON.parse(tc.function.arguments)
        } catch {
          tc.args = {}
        }
      }
    }
  } else {
    const response = await client.chat.completions.create({
      ...requestParams,
      stream: false,
    })

    const message = response.choices[0]?.message
    content = message?.content || ''

    if (message?.tool_calls) {
      toolCalls = message.tool_calls.map((tc) => {
        const funcCall = tc as {
          id: string
          function: { name: string; arguments: string }
        }
        return {
          id: funcCall.id,
          name: funcCall.function.name,
          function: {
            name: funcCall.function.name,
            arguments: funcCall.function.arguments,
          },
        }
      })
    }
  }

  return {
    content,
    thinking,
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
  }
}
