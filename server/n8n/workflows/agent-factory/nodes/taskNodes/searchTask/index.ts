import { print } from 'graphql'
import { MyTasksDocument } from 'src/gql/generated/myTasks'
import { NodeType } from '../../../interfaces'
import { searchTaskSchema } from './schema'

const searchTasksQuery = print(MyTasksDocument)

const schemaDescription = JSON.stringify(searchTaskSchema.describe(), null, 2)

type GetSearchTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getSearchTaskNode({
  agentId,
  agentName,
}: GetSearchTaskNodeProps): NodeType {
  return {
    parameters: {
      name: 'search_tasks',
      description:
        "Search agent's own Tasks. These are YOUR tasks as an agent, not user tasks",
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: searchTasksQuery,
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
    id: `${agentId}-tool-search-tasks`,
    name: 'Search Tasks Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2176, 528],
  }
}
