import { print } from 'graphql'
import { CreateMindLogDocument } from 'src/gql/generated/createMindLog'
import { DeleteMindLogDocument } from 'src/gql/generated/deleteMindLog'
import { MyMindLogsDocument } from 'src/gql/generated/myMindLogs'
import { UpdateMindLogDocument } from 'src/gql/generated/updateMindLog'
import { MindLogType } from 'src/gql/generated/types'
import { NodeType } from '../../interfaces'

const createMindLogQuery = print(CreateMindLogDocument)
const deleteMindLogQuery = print(DeleteMindLogDocument)
const searchMindLogsQuery = print(MyMindLogsDocument)
const updateMindLogQuery = print(UpdateMindLogDocument)

const mindLogTypeValues = Object.values(MindLogType).join(', ')

type getMindLogNodesProps = {
  agentId: string
  agentName: string
}

export function getMindLogNodes({ agentId, agentName }: getMindLogNodesProps) {
  const mindLogNodes: NodeType[] = [
    {
      parameters: {
        name: 'create_mindlog',
        description: `Create a MindLog entry. Types: ${mindLogTypeValues}. Identity (self-awareness, boundaries), Context (recent activity cache), Relationship (per-user info, requires relatedToUserId), Knowledge (useful facts), Error (error logs).`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: createMindLogQuery,
            variables: `={{ JSON.stringify({ data: { type: $fromAI('type', 'MindLog type: ${mindLogTypeValues}', 'string'), data: $fromAI('data', 'Content to save', 'string'), relatedToUserId: $fromAI('relatedToUserId', 'User ID for Relationship type (optional)', 'string') || undefined } }) }}`,
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
      id: `${agentId}-tool-create-mindlog`,
      name: 'Create MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [800, 528],
    },
    {
      parameters: {
        name: 'search_mindlogs',
        description: `Search MindLog entries. Filter by type and/or relatedToUserId. Types: ${mindLogTypeValues}.`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: searchMindLogsQuery,
            variables: `={{ (() => { const where = {}; const type = $fromAI('type', 'Filter by type (optional): ${mindLogTypeValues}', 'string'); const userId = $fromAI('relatedToUserId', 'Filter by user ID (optional)', 'string'); if (type) where.type = type; if (userId) where.relatedToUserId = userId; return JSON.stringify({ where: Object.keys(where).length ? where : undefined, take: $fromAI('limit', 'Max results (default 50)', 'number') || 50 }); })() }}`,
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
      id: `${agentId}-tool-search-mindlogs`,
      name: 'Search MindLogs Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1408, 528],
    },
    {
      parameters: {
        name: 'update_mindlog',
        description:
          'Update an existing MindLog entry by ID. Use to update Identity, Context, Relationship or any other MindLog.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: updateMindLogQuery,
            variables:
              "={{ JSON.stringify({ where: { id: $fromAI('id', 'MindLog ID to update', 'string') }, data: { data: $fromAI('data', 'New content', 'string') } }) }}",
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
      id: `${agentId}-tool-update-mindlog`,
      name: 'Update MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [992, 528],
    },
    {
      parameters: {
        name: 'delete_mindlog',
        description:
          'Delete a MindLog entry by ID. Use to remove outdated or incorrect entries.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: deleteMindLogQuery,
            variables:
              "={{ JSON.stringify({ where: { id: $fromAI('id', 'MindLog ID to delete', 'string') } }) }}",
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
      id: `${agentId}-tool-delete-mindlog`,
      name: 'Delete MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1184, 528],
    },
  ]

  return mindLogNodes
}
