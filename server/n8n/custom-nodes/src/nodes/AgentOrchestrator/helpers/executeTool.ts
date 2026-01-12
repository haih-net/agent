import { ExecuteContext, ToolCall } from './types'

export const executeTool = async (
  ctx: ExecuteContext,
  toolCall: ToolCall,
  debugLog?: (msg: string) => void,
): Promise<string> => {
  const log =
    debugLog ??
    function noop(): void {
      return
    }

  try {
    log(`executeTool: Getting connected tools for ${toolCall.name}`)
    const connectedTools = await ctx.getInputConnectionData('ai_tool', 0)

    if (!connectedTools) {
      log(`executeTool: No connected tools found`)
      return `Tool ${toolCall.name} not found - no tools connected`
    }

    const toolsArray = Array.isArray(connectedTools)
      ? connectedTools
      : [connectedTools]

    log(
      `executeTool: Found ${toolsArray.length} tools: ${toolsArray.map((t: { name?: string }) => t.name).join(', ')}`,
    )

    const tool = toolsArray.find(
      (t: { name?: string }) => t.name === toolCall.name,
    ) as
      | {
          name?: string
          invoke?: (args: Record<string, unknown>) => Promise<string>
        }
      | undefined

    if (!tool) {
      log(`executeTool: Tool ${toolCall.name} not found in connected tools`)
      return `Tool ${toolCall.name} not found in available tools`
    }

    if (tool.invoke) {
      log(
        `executeTool: Invoking ${toolCall.name} with args: ${JSON.stringify(toolCall.arguments)}`,
      )
      const result = await tool.invoke(toolCall.arguments)
      log(
        `executeTool: ${toolCall.name} returned: ${result?.substring(0, 100)}...`,
      )
      return result
    }

    log(`executeTool: Tool ${toolCall.name} has no invoke method`)
    return `Tool ${toolCall.name} has no invoke method`
  } catch (e: unknown) {
    const errorMsg = (e as Error).message
    log(`executeTool: Error executing ${toolCall.name}: ${errorMsg}`)
    return `Tool error: ${errorMsg}`
  }
}
