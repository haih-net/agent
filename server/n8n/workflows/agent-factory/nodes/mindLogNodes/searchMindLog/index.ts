import { print } from 'graphql'
import { MyMindLogsDocument } from 'src/gql/generated/myMindLogs'
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
  return {
    parameters: {
      name: 'search_mindlogs',
      description: 'Search MindLog entries',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: searchMindLogsQuery,
          variables: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${schemaDescription}\`, 'json') }}`,
        },
        matchingColumns: [],
        schema: [
          {
            id: 'query',
            displayName: 'query',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'variables',
            displayName: 'variables',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-search-mindlogs`,
    name: 'Search MindLogs Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1408, 528],
  }
}
