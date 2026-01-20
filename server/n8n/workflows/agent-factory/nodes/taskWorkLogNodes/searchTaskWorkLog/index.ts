import { print } from 'graphql'
import { TaskWorkLogListDocument } from 'src/gql/generated/taskWorkLogList'
import { NodeType } from '../../../interfaces'
import { searchTaskWorkLogSchema } from './schema'

const searchTaskWorkLogQuery = print(TaskWorkLogListDocument)

const schemaDescription = JSON.stringify(
  searchTaskWorkLogSchema.describe(),
  null,
  2,
)

type GetSearchTaskWorkLogNodeProps = {
  agentId: string
  agentName: string
}

export function getSearchTaskWorkLogNode({
  agentId,
  agentName,
}: GetSearchTaskWorkLogNodeProps): NodeType {
  return {
    parameters: {
      name: 'search_task_work_log',
      description: 'Search task work log entries',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: searchTaskWorkLogQuery,
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
    id: `${agentId}-tool-search-task-work-log`,
    name: 'Search Task Work Log Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2560, 528],
  }
}
