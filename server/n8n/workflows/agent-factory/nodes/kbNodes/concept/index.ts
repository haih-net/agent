import * as fs from 'fs'
import * as path from 'path'
import { NodeType } from '../../../interfaces'
import { conceptOperations, conceptSchemas } from './schema'

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
  return {
    parameters: {
      name: 'kb_concept',
      description:
        'CRUD Manage Knowledge Base Concepts (entities like companies, positions, persons).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: combinedDocument,
          operationName: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${conceptOperations.join(', ')}', 'string') }}`,
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
    id: `${agentId}-tool-kb-concept`,
    name: 'KB Concept Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2200, 528],
  }
}
