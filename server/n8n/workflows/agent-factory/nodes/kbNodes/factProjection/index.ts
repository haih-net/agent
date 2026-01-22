import * as fs from 'fs'
import * as path from 'path'
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
  return {
    parameters: {
      name: 'kb_fact_projection',
      description:
        'CRUD Manage Knowledge Base Fact Projections (facts projected into knowledge spaces with trust/importance levels).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: combinedDocument,
          operationName: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factProjectionOperations.join(', ')}', 'string') }}`,
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
    id: `${agentId}-tool-kb-fact-projection`,
    name: 'KB Fact Projection Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2200, 1168],
  }
}
