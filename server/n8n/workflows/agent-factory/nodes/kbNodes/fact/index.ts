import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { factOperations, factSchemas } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const combinedDocument = fs.readFileSync(
  path.join(__dirname, '../../../../../../../src/gql/src/KBFact.graphql'),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    factOperations.map((op) => [op, factSchemas[op].describe()]),
  ),
  null,
  2,
)

type GetFactNodeProps = {
  agentId: string
  agentName: string
}

export function getFactNode({
  agentId,
  agentName,
}: GetFactNodeProps): NodeType {
  return createTool({
    name: 'kb_fact',
    toolName: 'KB Fact Tool',
    description:
      'CRUD Manage Knowledge Base Facts (statements with confidence, importance, validity period).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-kb-fact`,
    position: getNodeCoordinates('tool-kb-fact'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factOperations.join(', ')}', 'string') }}`,
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
