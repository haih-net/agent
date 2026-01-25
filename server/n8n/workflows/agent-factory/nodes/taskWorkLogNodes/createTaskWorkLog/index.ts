import { print } from 'graphql'
import { CreateTaskWorkLogDocument } from 'src/gql/generated/createTaskWorkLog'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { createTaskWorkLogSchema } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

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
  return createTool({
    name: 'create_task_work_log',
    toolName: 'Create Task Work Log Tool',
    description: "Add work log entry to an agent's own Task",
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-create-task-work-log`,
    position: getNodeCoordinates('tool-create-task-work-log'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: createTaskWorkLogQuery,
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
