import { IExecuteFunctions } from 'n8n-workflow'

export const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'

/**
 * Represents a tool call from LLM response.
 */
export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

/**
 * Standardized LLM response structure with optional tool calls.
 * Supports both OpenAI-style (function.name/arguments) and simplified (name/args) formats.
 */
export interface LLMResponse {
  content: string
  thinking?: string
  tool_calls?: Array<{
    id: string
    name?: string
    args?: Record<string, unknown>
    function?: {
      name: string
      arguments: string
    }
  }>
}

/**
 * Chat message structure for LLM conversations.
 */
export interface Message {
  role: string
  content: string | null
  tool_calls?: LLMResponse['tool_calls']
  tool_call_id?: string
}

/**
 * Chat model interface with streaming and invoke methods.
 */
export interface ChatModel {
  stream?: (
    messages: Message[],
    options: Record<string, unknown>,
  ) => AsyncIterable<{
    content?: string
    tool_calls?: LLMResponse['tool_calls']
  }>
  invoke?: (
    messages: Message[],
    options: Record<string, unknown>,
  ) => Promise<{
    content?: string
    tool_calls?: LLMResponse['tool_calls']
  }>
}

/**
 * Extended IExecuteFunctions with additional methods for AI nodes.
 * Provides access to connected AI components and streaming capabilities.
 */
export interface ExecuteContext extends IExecuteFunctions {
  getInputConnectionData: (type: string, index: number) => Promise<unknown>
  sendChunk: (type: string, index: number, content?: string) => void
}
