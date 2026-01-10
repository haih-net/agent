import { INodeExecutionData } from 'n8n-workflow'
import { ExecuteContext } from './types'
import { buildMessages } from './buildMessages'
import { getConnectedTools } from './getConnectedTools'
import { extractToolCalls } from './extractToolCalls'
import { callLLM } from './callLLM'

export const executeValidatorMode = async (
  ctx: ExecuteContext,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[][]> => {
  const systemMessage = ctx.getNodeParameter('systemMessage', 0, '') as string
  const userInput = (items[0]?.json?.chatInput as string) || ''

  const tools = await getConnectedTools(ctx)
  const messages = buildMessages(systemMessage, userInput, [])

  const response = await callLLM(ctx, messages, tools, 'required', false)
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
