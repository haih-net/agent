import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { knowledgeSpaceOperations, knowledgeSpaceSchemas } from './schema'
import { getNodeCoordinates } from '../../../../helpers/nodeCoordinates'

const combinedDocument = fs.readFileSync(
  path.join(
    __dirname,
    '../../../../../../../src/gql/src/KBKnowledgeSpace.graphql',
  ),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    knowledgeSpaceOperations.map((op) => [
      op,
      knowledgeSpaceSchemas[op].describe(),
    ]),
  ),
  null,
  2,
)

type GetKnowledgeSpaceNodeProps = {
  agentId: string
  agentName: string
}

export function getKnowledgeSpaceNode({
  agentId,
  agentName,
}: GetKnowledgeSpaceNodeProps): NodeType {
  return createTool({
    name: 'kb_knowledge_space',
    toolName: 'KB Knowledge Space Tool',
    description:
      'CRUD Manage Knowledge Base Knowledge Spaces (containers for fact projections, can be private, public, or shared).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-kb-knowledge-space`,
    position: getNodeCoordinates('tool-kb-knowledge-space'),
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${knowledgeSpaceOperations.join(', ')}', 'string') }}`,
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
