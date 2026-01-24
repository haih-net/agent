import { print } from 'graphql'
import { MyMindLogsDocument } from 'src/gql/generated/myMindLogs'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { searchMindLogSchema } from './schema'

const searchMindLogsQuery = print(MyMindLogsDocument)

const schemaDescription = JSON.stringify(
  searchMindLogSchema.describe(),
  null,
  2,
)

type GetSearchMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getSearchMindLogNode({
  agentId,
  agentName,
}: GetSearchMindLogNodeProps): NodeType {
  return createTool({
    name: 'search_mindlogs',
    toolName: 'Search MindLogs Tool',
    description: 'Search MindLog entries',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-search-mindlogs`,
    position: [1408, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: searchMindLogsQuery,
        type: 'string',
        required: true,
      },
      {
        name: 'variables',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${schemaDescription}\`, 'json') }}`,
        type: 'string',
        required: true,
      },
    ]),
  })
}
