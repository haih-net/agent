import { print } from 'graphql'
import { UpdateTaskDocument } from 'src/gql/generated/updateTask'
import { NodeType } from '../../../interfaces'
import { updateTaskSchema } from './schema'

const updateTaskQuery = print(UpdateTaskDocument)

const schemaDescription = JSON.stringify(updateTaskSchema.describe(), null, 2)

type GetUpdateTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getUpdateTaskNode({
  agentId,
  agentName,
}: GetUpdateTaskNodeProps): NodeType {
  return {
    parameters: {
      name: 'update_task',
      description:
        "Update an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks",
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: updateTaskQuery,
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
    id: `${agentId}-tool-update-task`,
    name: 'Update Task Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1792, 528],
  }
}
