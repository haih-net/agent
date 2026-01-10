import { ExecuteContext, ToolCall } from './types'

export const executeTool = async (
  ctx: ExecuteContext,
  toolCall: ToolCall,
): Promise<string> => {
  try {
    const connectedTools = await ctx.getInputConnectionData('ai_tool', 0)
    if (!connectedTools) {
      return `Tool ${toolCall.name} not found`
    }

    const toolsArray = Array.isArray(connectedTools)
      ? connectedTools
      : [connectedTools]
    const tool = toolsArray.find(
      (t: { name?: string }) => t.name === toolCall.name,
    ) as
      | {
          name?: string
          invoke?: (args: Record<string, unknown>) => Promise<string>
        }
      | undefined

    if (!tool) {
      return `Tool ${toolCall.name} not found`
    }

    if (tool.invoke) {
      const result = await tool.invoke(toolCall.arguments)
      return result
    }

    return `Tool ${toolCall.name} executed with args: ${JSON.stringify(toolCall.arguments)}`
  } catch (e: unknown) {
    return `Tool error: ${(e as Error).message}`
  }
}
