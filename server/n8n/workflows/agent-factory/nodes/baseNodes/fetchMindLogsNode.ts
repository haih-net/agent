import { print } from 'graphql'
import {
  MyMindLogsDocument,
  MyMindLogsQueryVariables,
} from 'src/gql/generated/myMindLogs'
import { MindLogType, MindLogWhereInput } from 'src/gql/generated/types'
import { NodeType } from '../../interfaces'

const myMindLogsQuery = print(MyMindLogsDocument)

const FETCH_MINDLOG_TYPES: MindLogType[] = [
  MindLogType.KNOWLEDGE,
  MindLogType.IDENTITY,
  MindLogType.CONTEXT,
]

type GetFetchMindLogsNodeProps = {
  agentId: string
  agentName: string
}

function buildVariables(userId?: string): MyMindLogsQueryVariables {
  const where: MindLogWhereInput = {
    type: { in: FETCH_MINDLOG_TYPES },
  }

  if (userId) {
    where.relatedToUserId = userId
  }

  return {
    where,
    take: 100,
  }
}

export function getFetchMindLogsNode({
  agentId,
  agentName,
}: GetFetchMindLogsNodeProps): NodeType {
  const baseVariables = buildVariables()

  const typesArray = JSON.stringify(FETCH_MINDLOG_TYPES)

  const variables = `={{ (() => {
    const types = ${typesArray};
    const userId = $json.user?.id;
    const where = { type: { in: types } };
    if (userId) where.relatedToUserId = userId;
    return JSON.stringify({ where: where, take: ${baseVariables.take} });
  })() }}`

  return {
    parameters: {
      workflowId: {
        __rl: true,
        mode: 'list',
        value: `Tool: GraphQL Request (${agentName})`,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          query: myMindLogsQuery,
          variables,
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
    id: `${agentId}-fetch-mindlogs`,
    name: 'Fetch MindLogs',
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position: [-16, 304] as [number, number],
  }
}
