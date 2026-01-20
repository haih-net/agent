import { print } from 'graphql'
import { CreateMindLogDocument } from 'src/gql/generated/createMindLog'
import { NodeType } from '../../../interfaces'
import { createMindLogSchema } from './schema'

const createMindLogQuery = print(CreateMindLogDocument)

const schemaDescription = JSON.stringify(
  createMindLogSchema.describe(),
  null,
  2,
)

type GetCreateMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getCreateMindLogNode({
  agentId,
  agentName,
}: GetCreateMindLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'create_mindlog',
      description: 'Create a MindLog entry',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: createMindLogQuery,
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
    id: `${agentId}-tool-create-mindlog`,
    name: 'Create MindLog Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [800, 528],
  }
}
