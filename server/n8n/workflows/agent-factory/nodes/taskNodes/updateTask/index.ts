import { print } from 'graphql'
import { UpdateTaskDocument } from 'src/gql/generated/updateTask'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { updateTaskSchema } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const updateTaskQuery = print(UpdateTaskDocument)

const schemaDescription = JSON.stringify(updateTaskSchema.describe(), null, 2)

type GetUpdateTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getUpdateTaskNode({
  agentId,
  agentName,
}: GetUpdateTaskNodeProps): NodeType {
  return createTool({
    name: 'update_task',
    toolName: 'Update Task Tool',
    description:
      "Update an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks",
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-update-task`,
    position: getNodeCoordinates('tool-update-task'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: updateTaskQuery,
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
