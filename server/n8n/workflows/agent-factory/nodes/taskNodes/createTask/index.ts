import { print } from 'graphql'
import { CreateTaskDocument } from 'src/gql/generated/createTask'
import { NodeType } from '../../../interfaces'
import { createTaskSchema } from './schema'

const createTaskQuery = print(CreateTaskDocument)

const schemaDescription = JSON.stringify(createTaskSchema.describe(), null, 2)

type GetCreateTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getCreateTaskNode({
  agentId,
  agentName,
}: GetCreateTaskNodeProps): NodeType {
  return {
    parameters: {
      name: 'create_task',
      description: `Create an agent's own Task. These are YOUR tasks as an agent, not user tasks`,
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: createTaskQuery,
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
    id: `${agentId}-tool-create-task`,
    name: 'Create Task Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1600, 528],
  }
}
