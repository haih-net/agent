import { INodeExecutionData } from 'n8n-workflow'
import { ExecuteContext } from './types'
import { buildMessages } from './buildMessages'
import { getConnectedTools } from './getConnectedTools'
import { extractToolCalls } from './extractToolCalls'
import { callLLM } from './callLLM'

interface OpenRouterCredentials {
  apiKey: string
  url: string
}

export const executeValidatorMode = async (
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
  const systemMessage = ctx.getNodeParameter('systemMessage', 0, '') as string
  const userInput = (items[0]?.json?.chatInput as string) || ''
  const user = items[0]?.json?.user as
    | { id: string; username?: string; fullname?: string }
    | null
    | undefined
  const sessionId = (items[0]?.json?.sessionId as string) || ''

  const tools = await getConnectedTools(ctx)
  const messages = buildMessages(systemMessage, userInput, [], {
    user,
    sessionId,
  })

  const response = await callLLM({
    ctx,
    credentials,
    model,
    messages,
    tools,
    toolChoice: 'required',
    streaming: false,
  })
  const toolCalls = extractToolCalls(response)

  return [
    items.map((item) => ({
      json: {
        ...item.json,
        output: response.content || '',
        toolCalls,
        rawResponse: response,
        mode: 'validator',
      },
    })),
  ]
}
