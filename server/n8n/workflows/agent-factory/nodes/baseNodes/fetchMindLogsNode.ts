import { print } from 'graphql'
import { MyMindLogsDocument } from 'src/gql/generated/myMindLogs'
import { MindLogType } from 'src/gql/generated/types'
import { NodeType } from '../../interfaces'

const myMindLogsQuery = print(MyMindLogsDocument)

const FETCH_MINDLOG_TYPES: MindLogType[] = [
  MindLogType.KNOWLEDGE,
  MindLogType.IDENTITY,
  MindLogType.CONTEXT,
]

const FETCH_MINDLOGS_TAKE = 100

type GetFetchMindLogsNodeProps = {
  agentId: string
  agentName: string
}

export function getFetchMindLogsNode({
  agentId,
  agentName,
}: GetFetchMindLogsNodeProps): NodeType {
  const typesArray = JSON.stringify(FETCH_MINDLOG_TYPES)

  const variables = `={{ (() => {
    const types = ${typesArray};
    let userData = null;
    try {
      if ($('Set Auth Context').isExecuted) {
        userData = $('Set Auth Context').first().json.user || null;
      }
    } catch {}
    if (!userData) {
      if ($('Execute Workflow Trigger').isExecuted) {
        userData = $('Execute Workflow Trigger').first().json.user || null;
      } else if ($('When chat message received').isExecuted) {
        userData = $('When chat message received').first().json.user || null;
      }
    }
    const userId = userData?.id || null;
    const where = { type: { in: types } };
    if (userId) where.relatedToUserId = userId;
    return JSON.stringify({ where: where, take: ${FETCH_MINDLOGS_TAKE} });
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
    position: [-496, 416] as [number, number],
  }
}
