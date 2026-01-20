import { print } from 'graphql'
import { UpdateMindLogDocument } from 'src/gql/generated/updateMindLog'
import { NodeType } from '../../../interfaces'
import { updateMindLogSchema } from './schema'

const updateMindLogQuery = print(UpdateMindLogDocument)

const schemaDescription = JSON.stringify(
  updateMindLogSchema.describe(),
  null,
  2,
)

type GetUpdateMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getUpdateMindLogNode({
  agentId,
  agentName,
}: GetUpdateMindLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'update_mindlog',
      description: 'Update a MindLog entry by ID',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: updateMindLogQuery,
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
    id: `${agentId}-tool-update-mindlog`,
    name: 'Update MindLog Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [992, 528],
  }
}
