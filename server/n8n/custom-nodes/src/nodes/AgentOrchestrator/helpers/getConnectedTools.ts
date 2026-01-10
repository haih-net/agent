import { ExecuteContext } from './types'

export const getConnectedTools = async (ctx: ExecuteContext) => {
  try {
    const connectedTools = await ctx.getInputConnectionData('ai_tool', 0)
    if (!connectedTools) {
      return []
    }

    const toolsArray = Array.isArray(connectedTools)
      ? connectedTools
      : [connectedTools]

    return toolsArray.map(
      (tool: {
        name?: string
        description?: string
        schema?: Record<string, unknown>
      }) => ({
        type: 'function',
        function: {
          name: tool.name || 'unknown_tool',
          description: tool.description || '',
          parameters: tool.schema || { type: 'object', properties: {} },
        },
      }),
    )
  } catch {
    return []
  }
}
