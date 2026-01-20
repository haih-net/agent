import { print } from 'graphql'
import { DeleteTaskWorkLogDocument } from 'src/gql/generated/deleteTaskWorkLog'
import { NodeType } from '../../../interfaces'
import { deleteTaskWorkLogSchema } from './schema'

const deleteTaskWorkLogQuery = print(DeleteTaskWorkLogDocument)

const schemaDescription = JSON.stringify(
  deleteTaskWorkLogSchema.describe(),
  null,
  2,
)

type GetDeleteTaskWorkLogNodeProps = {
  agentId: string
  agentName: string
}

export function getDeleteTaskWorkLogNode({
  agentId,
  agentName,
}: GetDeleteTaskWorkLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'delete_task_work_log',
      description: 'Delete a task work log entry by ID',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: deleteTaskWorkLogQuery,
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
    id: `${agentId}-tool-delete-task-work-log`,
    name: 'Delete Task Work Log Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2752, 528],
  }
}
