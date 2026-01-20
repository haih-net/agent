import { print } from 'graphql'
import { CreateTaskWorkLogDocument } from 'src/gql/generated/createTaskWorkLog'
import { NodeType } from '../../../interfaces'
import { createTaskWorkLogSchema } from './schema'

const createTaskWorkLogQuery = print(CreateTaskWorkLogDocument)

const schemaDescription = JSON.stringify(
  createTaskWorkLogSchema.describe(),
  null,
  2,
)

type GetCreateTaskWorkLogNodeProps = {
  agentId: string
  agentName: string
}

export function getCreateTaskWorkLogNode({
  agentId,
  agentName,
}: GetCreateTaskWorkLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'create_task_work_log',
      description: "Add work log entry to an agent's own Task",
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: createTaskWorkLogQuery,
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
    id: `${agentId}-tool-create-task-work-log`,
    name: 'Create Task Work Log Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2368, 528],
  }
}
