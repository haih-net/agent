import { ExecuteContext } from './types'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { z } from 'zod'

interface N8nTool {
  name?: string
  description?: string
  schema?: z.ZodType | Record<string, unknown>
}

const convertSchemaToJsonSchema = (
  schema: z.ZodType | Record<string, unknown> | undefined,
): Record<string, unknown> => {
  if (!schema) {
    return { type: 'object', properties: {} }
  }

  if (typeof schema === 'object' && '_def' in schema) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return zodToJsonSchema(schema as any)
    } catch {
      return { type: 'object', properties: {} }
    }
  }

  return schema as Record<string, unknown>
}

export const getConnectedTools = async (ctx: ExecuteContext) => {
  try {
    const connectedTools = await ctx.getInputConnectionData('ai_tool', 0)
    if (!connectedTools) {
      return []
    }

    const toolsArray = Array.isArray(connectedTools)
      ? connectedTools
      : [connectedTools]

    return toolsArray.map((tool: N8nTool) => ({
      type: 'function',
      function: {
        name: tool.name || 'unknown_tool',
        description: tool.description || '',
        parameters: convertSchemaToJsonSchema(tool.schema),
      },
    }))
  } catch {
    return []
  }
}
