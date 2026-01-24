import * as fs from 'fs'
import * as path from 'path'
import { createTool, createStaticInputs } from '../../../../helpers'
import { NodeType } from '../../../interfaces'
import { reactionOperations, reactionSchemas } from './schema'

const combinedDocument = fs.readFileSync(
  path.join(__dirname, '../../../../../../../src/gql/src/EXReaction.graphql'),
  'utf-8',
)

const variablesDescription = JSON.stringify(
  Object.fromEntries(
    reactionOperations.map((op) => [op, reactionSchemas[op].describe()]),
  ),
  null,
  2,
)

type GetReactionNodeProps = {
  agentId: string
  agentName: string
}

export function getReactionNode({
  agentId,
  agentName,
}: GetReactionNodeProps): NodeType {
  return createTool({
    name: 'ex_reaction',
    toolName: 'EX Reaction Tool',
    description:
      'CRUD Manage EX Reactions (specific responses to stimuli with scoring: agent, target, mentor).',
    workflowName: `Tool: GraphQL Request (${agentName})`,
    nodeId: `${agentId}-tool-ex-reaction`,
    position: [2200, 1188],
    inputs: createStaticInputs([
      {
        name: 'query',
        value: combinedDocument,
        type: 'string',
        required: true,
      },
      {
        name: 'operationName',
        value: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', 'One of: ${reactionOperations.join(', ')}', 'string') }}`,
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
