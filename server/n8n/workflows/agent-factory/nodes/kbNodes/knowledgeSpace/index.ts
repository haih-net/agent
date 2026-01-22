import * as fs from 'fs'
import * as path from 'path'
import { NodeType } from '../../../interfaces'
import { knowledgeSpaceOperations, knowledgeSpaceSchemas } from './schema'

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
  return {
    parameters: {
      name: 'kb_knowledge_space',
      description:
        'CRUD Manage Knowledge Base Knowledge Spaces (containers for fact projections, can be private, public, or shared).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: combinedDocument,
          operationName: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${knowledgeSpaceOperations.join(', ')}', 'string') }}`,
          variables: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${variablesDescription}\`, 'json') }}`,
        },
        matchingColumns: [],
        schema: [
          {
            id: 'query',
            displayName: 'query',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'operationName',
            displayName: 'operationName',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'variables',
            displayName: 'variables',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-kb-knowledge-space`,
    name: 'KB Knowledge Space Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2200, 1008],
  }
}
