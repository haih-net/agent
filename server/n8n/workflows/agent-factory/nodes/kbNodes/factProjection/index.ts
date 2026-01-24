import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { factProjectionOperations, factProjectionSchemas } from './schema'

const combinedDocument = fs.readFileSync(
  path.join(
    __dirname,
    '../../../../../../../src/gql/src/KBFactProjection.graphql',
  ),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    factProjectionOperations.map((op) => [
      op,
      factProjectionSchemas[op].describe(),
    ]),
  ),
  null,
  2,
)

type GetFactProjectionNodeProps = {
  agentId: string
  agentName: string
}

export function getFactProjectionNode({
  agentId,
  agentName,
}: GetFactProjectionNodeProps): NodeType {
  return createTool({
    name: 'kb_fact_projection',
    toolName: 'KB Fact Projection Tool',
    description:
      'CRUD Manage Knowledge Base Fact Projections (facts projected into knowledge spaces with trust/importance levels).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-kb-fact-projection`,
    position: [2200, 1168],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factProjectionOperations.join(', ')}', 'string') }}`,
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
