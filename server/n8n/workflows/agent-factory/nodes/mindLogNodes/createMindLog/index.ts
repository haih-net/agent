import { print } from 'graphql'
import { CreateMindLogDocument } from 'src/gql/generated/createMindLog'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { createMindLogSchema } from './schema'

const createMindLogQuery = print(CreateMindLogDocument)

const schemaDescription = JSON.stringify(
  createMindLogSchema.describe(),
  null,
  2,
)

type GetCreateMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getCreateMindLogNode({
  agentId,
  agentName,
}: GetCreateMindLogNodeProps): NodeType {
  return createTool({
    name: 'create_mindlog',
    toolName: 'Create MindLog Tool',
    description: 'Create a MindLog entry',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-create-mindlog`,
    position: [800, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: createMindLogQuery,
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
