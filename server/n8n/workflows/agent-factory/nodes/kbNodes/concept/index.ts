import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { conceptOperations, conceptSchemas } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const combinedDocument = fs.readFileSync(
  path.join(__dirname, '../../../../../../../src/gql/src/KBConcept.graphql'),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    conceptOperations.map((op) => [op, conceptSchemas[op].describe()]),
  ),
  null,
  2,
)

type GetConceptNodeProps = {
  agentId: string
  agentName: string
}

export function getConceptNode({
  agentId,
  agentName,
}: GetConceptNodeProps): NodeType {
  return createTool({
    name: 'kb_concept',
    toolName: 'KB Concept Tool',
    description:
      'CRUD Manage Knowledge Base Concepts (entities like companies, positions, persons).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-kb-concept`,
    position: getNodeCoordinates('tool-kb-concept'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${conceptOperations.join(', ')}', 'string') }}`,
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
