import { print } from 'graphql'
import { DeleteMindLogDocument } from 'src/gql/generated/deleteMindLog'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { deleteMindLogSchema } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const deleteMindLogQuery = print(DeleteMindLogDocument)

const schemaDescription = JSON.stringify(
  deleteMindLogSchema.describe(),
  null,
  2,
)

type GetDeleteMindLogNodeProps = {
  agentId: string
  agentName: string
}

export function getDeleteMindLogNode({
  agentId,
  agentName,
}: GetDeleteMindLogNodeProps): NodeType {
  return createTool({
    name: 'delete_mindlog',
    toolName: 'Delete MindLog Tool',
    description: 'Delete a MindLog entry by ID',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-delete-mindlog`,
    position: getNodeCoordinates('tool-delete-mindlog'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: deleteMindLogQuery,
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
