import { print } from 'graphql'
import { UpdateMindLogDocument } from 'src/gql/generated/updateMindLog'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { updateMindLogSchema } from './schema'

const updateMindLogQuery = print(UpdateMindLogDocument)

const schemaDescription = JSON.stringify(
  updateMindLogSchema.describe(),
  null,
  2,
)

type GetUpdateMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getUpdateMindLogNode({
  agentId,
  agentName,
}: GetUpdateMindLogNodeProps): NodeType {
  return createTool({
    name: 'update_mindlog',
    toolName: 'Update MindLog Tool',
    description: 'Update a MindLog entry by ID',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-update-mindlog`,
    position: [992, 528],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: updateMindLogQuery,
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
