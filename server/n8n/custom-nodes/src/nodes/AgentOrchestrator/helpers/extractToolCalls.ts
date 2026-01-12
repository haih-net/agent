import { LLMResponse, ToolCall } from './types'
import { parseJson } from './parseJson'

export const extractToolCalls = (response: LLMResponse): ToolCall[] => {
  if (!response.tool_calls) {
    return []
  }

  return response.tool_calls.map((tc) => ({
    id: tc.id,
    name: tc.name || tc.function?.name || '',
    arguments: tc.args || parseJson(tc.function?.arguments, {}),
  }))
}
