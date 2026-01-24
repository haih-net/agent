import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { factParticipationOperations, factParticipationSchemas } from './schema'

const combinedDocument = fs.readFileSync(
  path.join(
    __dirname,
    '../../../../../../../src/gql/src/KBFactParticipation.graphql',
  ),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    factParticipationOperations.map((op) => [
      op,
      factParticipationSchemas[op].describe(),
    ]),
  ),
  null,
  2,
)

type GetFactParticipationNodeProps = {
  agentId: string
  agentName: string
}

export function getFactParticipationNode({
  agentId,
  agentName,
}: GetFactParticipationNodeProps): NodeType {
  return createTool({
    name: 'kb_fact_participation',
    toolName: 'KB Fact Participation Tool',
    description:
      'CRUD Manage Knowledge Base Fact Participations (N-ary relationships between facts and concepts with roles).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-kb-fact-participation`,
    position: [2200, 848],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factParticipationOperations.join(', ')}', 'string') }}`,
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
