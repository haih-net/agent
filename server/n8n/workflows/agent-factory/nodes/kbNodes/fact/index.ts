import * as fs from 'fs'
import * as path from 'path'
import { NodeType } from '../../../interfaces'
import { factOperations, factSchemas } from './schema'

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
  return {
    parameters: {
      name: 'kb_fact',
      description:
        'CRUD Manage Knowledge Base Facts (statements with confidence, importance, validity period).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: combinedDocument,
          operationName: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${factOperations.join(', ')}', 'string') }}`,
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
    id: `${agentId}-tool-kb-fact`,
    name: 'KB Fact Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2200, 688],
  }
}
