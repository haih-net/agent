import * as fs from 'fs'
import * as path from 'path'
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
  return {
    parameters: {
      name: 'kb_fact_participation',
      description:
        'CRUD Manage Knowledge Base Fact Participations (N-ary relationships between facts and concepts with roles).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: combinedDocument,
          operationName: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factParticipationOperations.join(', ')}', 'string') }}`,
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
    id: `${agentId}-tool-kb-fact-participation`,
    name: 'KB Fact Participation Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2200, 848],
  }
}
