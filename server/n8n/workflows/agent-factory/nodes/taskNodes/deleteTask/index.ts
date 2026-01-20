import { print } from 'graphql'
import { DeleteTaskDocument } from 'src/gql/generated/deleteTask'
import { NodeType } from '../../../interfaces'
import { deleteTaskSchema } from './schema'

const deleteTaskQuery = print(DeleteTaskDocument)

const schemaDescription = JSON.stringify(deleteTaskSchema.describe(), null, 2)

type GetDeleteTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getDeleteTaskNode({
  agentId,
  agentName,
}: GetDeleteTaskNodeProps): NodeType {
  return {
    parameters: {
      name: 'delete_task',
      description:
        "Delete an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks",
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: deleteTaskQuery,
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
    id: `${agentId}-tool-delete-task`,
    name: 'Delete Task Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1984, 528],
  }
}
