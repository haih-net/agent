import { print } from 'graphql'
import { TaskWorkLogListDocument } from 'src/gql/generated/taskWorkLogList'
import { createTool, createStaticInputs } from '../../../../helpers'
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
  return createTool({
    name: 'search_task_work_log',
    toolName: 'Search Task Work Log Tool',
    description: 'Search task work log entries',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-search-task-work-log`,
    position: [2560, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: searchTaskWorkLogQuery,
        type: 'string',
        required: true,
      },
      {
        name: 'variables',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${schemaDescription}\`, 'json') }}`,
        type: 'string',
        required: true,
      },
    ]),
  })
}
