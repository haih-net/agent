import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { reflexOperations, reflexSchemas } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const combinedDocument = fs.readFileSync(
  path.join(__dirname, '../../../../../../../src/gql/src/EXReflex.graphql'),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    reflexOperations.map((op) => [op, reflexSchemas[op].describe()]),
  ),
  null,
  2,
)

type GetReflexNodeProps = {
  agentId: string
  agentName: string
}

export function getReflexNode({
  agentId,
  agentName,
}: GetReflexNodeProps): NodeType {
  return createTool({
    name: 'ex_reflex',
    toolName: 'EX Reflex Tool',
    description:
      'CRUD Manage EX Reflexes (behavioral rules: stimulus → response patterns with effectiveness tracking).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-ex-reflex`,
    position: getNodeCoordinates('tool-ex-reflex'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${reflexOperations.join(', ')}', 'string') }}`,
        type: 'string',
        required: true,
      },
      {
        name: 'variables',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${variablesDescription}\`, 'json') }}`,
        type: 'string',
        required: true,
      },
    ]),
  })
}
