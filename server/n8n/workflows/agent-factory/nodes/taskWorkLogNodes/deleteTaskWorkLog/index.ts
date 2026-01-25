import { print } from 'graphql'
import { DeleteTaskWorkLogDocument } from 'src/gql/generated/deleteTaskWorkLog'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { deleteTaskWorkLogSchema } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

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
  return createTool({
    name: 'delete_task_work_log',
    toolName: 'Delete Task Work Log Tool',
    description: 'Delete a task work log entry by ID',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-delete-task-work-log`,
    position: getNodeCoordinates('tool-delete-task-work-log'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: deleteTaskWorkLogQuery,
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
