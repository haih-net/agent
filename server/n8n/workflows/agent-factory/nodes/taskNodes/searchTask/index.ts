import { print } from 'graphql'
import { MyTasksDocument } from 'src/gql/generated/myTasks'
import { createTool, createStaticInputs } from '../../../../helpers'
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
  return createTool({
    name: 'search_tasks',
    toolName: 'Search Tasks Tool',
    description:
      "Search agent's own Tasks. These are YOUR tasks as an agent, not user tasks",
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-search-tasks`,
    position: [2176, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: searchTasksQuery,
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
