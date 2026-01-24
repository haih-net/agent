import { print } from 'graphql'
import { DeleteTaskDocument } from 'src/gql/generated/deleteTask'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { deleteTaskSchema } from './schema'

const deleteTaskQuery = print(DeleteTaskDocument)

const schemaDescription = JSON.stringify(deleteTaskSchema.describe(), null, 2)

type GetDeleteTaskNodeProps = {
  agentId: string
  agentName: string
}

export function getDeleteTaskNode({
  agentId,
  agentName,
}: GetDeleteTaskNodeProps): NodeType {
  return createTool({
    name: 'delete_task',
    toolName: 'Delete Task Tool',
    description:
      "Delete an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks",
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-delete-task`,
    position: [1984, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: deleteTaskQuery,
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
