import { print } from 'graphql'
import { CreateTaskDocument } from 'src/gql/generated/createTask'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { createTaskSchema } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

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
  return createTool({
    name: 'create_task',
    toolName: 'Create Task Tool',
    description: `Create an agent's own Task. These are YOUR tasks as an agent, not user tasks`,
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-create-task`,
    position: getNodeCoordinates('tool-create-task'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: createTaskQuery,
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
