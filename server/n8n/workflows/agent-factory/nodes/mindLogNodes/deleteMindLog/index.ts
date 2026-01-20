import { print } from 'graphql'
import { DeleteMindLogDocument } from 'src/gql/generated/deleteMindLog'
import { NodeType } from '../../../interfaces'
import { deleteMindLogSchema } from './schema'

const deleteMindLogQuery = print(DeleteMindLogDocument)

const schemaDescription = JSON.stringify(
  deleteMindLogSchema.describe(),
  null,
  2,
)

type GetDeleteMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getDeleteMindLogNode({
  agentId,
  agentName,
}: GetDeleteMindLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'delete_mindlog',
      description: 'Delete a MindLog entry by ID',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: deleteMindLogQuery,
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
    id: `${agentId}-tool-delete-mindlog`,
    name: 'Delete MindLog Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1184, 528],
  }
}
