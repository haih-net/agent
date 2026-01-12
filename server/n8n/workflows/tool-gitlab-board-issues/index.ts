import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'

interface GitLabCredential {
  data: {
    server: string
    accessToken: string
  }
  config: {
    owner: string
    testRepo: string
    testBoardGroup?: string
    testBoardId?: string
    testIssueIid?: string
    testListId?: string
  }
}

function loadGitLabCredential(): GitLabCredential | null {
  const credPath = path.join(
    __dirname,
    '../../../../credentials/system/gitlab.json',
  )
  if (!fs.existsSync(credPath)) {
    return null
  }
  const content = JSON.parse(fs.readFileSync(credPath, 'utf-8'))
  const cred = Array.isArray(content) ? content[0] : content
  if (!cred?.data?.server || !cred?.config) {
    return null
  }
  return cred
}

const gitlabCred = loadGitLabCredential()
const serverUrl = gitlabCred?.data.server.replace(/\/$/, '') || ''

const graphqlQuery = `query BoardListsEE($fullPath: ID!, $boardId: BoardID!, $id: ListID, $filters: BoardIssueInput, $isGroup: Boolean = false, $isProject: Boolean = false, $after: String, $first: Int) {
  group(fullPath: $fullPath) @include(if: $isGroup) {
    id
    board(id: $boardId) {
      id
      lists(id: $id, issueFilters: $filters) {
        nodes {
          id
          listType
          issues(first: $first, filters: $filters, after: $after) {
            nodes {
              ...Issue
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  }
  project(fullPath: $fullPath) @include(if: $isProject) {
    id
    board(id: $boardId) {
      id
      lists(id: $id, issueFilters: $filters) {
        nodes {
          id
          listType
          issues(first: $first, filters: $filters, after: $after) {
            nodes {
              ...Issue
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  }
}

fragment Issue on Issue {
  id
  iid
  title
  referencePath: reference(full: true)
  closedAt
  dueDate
  webUrl
  type
  milestone {
    id
    title
    state
  }
  assignees {
    nodes {
      id
      name
      username
    }
  }
  labels {
    nodes {
      id
      title
      color
    }
  }
}`

function createWorkflow(): WorkflowBase | null {
  if (!gitlabCred) {
    return null
  }

  return {
    name: 'Tool: GitLab Board Issues',
    active: true,
    versionId: 'tool-gitlab-board-issues-v1',
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'fullPath',
                type: 'string',
              },
              {
                name: 'boardId',
                type: 'string',
              },
              {
                name: 'listId',
                type: 'string',
              },
              {
                name: 'isGroup',
                type: 'boolean',
              },
              {
                name: 'assignee',
                type: 'string',
              },
              {
                name: 'first',
                type: 'number',
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-200, 304],
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [-200, 504],
        id: 'manual-trigger',
        name: 'Manual Trigger',
      },
      {
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'fullPath',
                name: 'fullPath',
                value: gitlabCred.config.testBoardGroup || '',
                type: 'string',
              },
              {
                id: 'boardId',
                name: 'boardId',
                value: gitlabCred.config.testBoardId || '',
                type: 'string',
              },
              {
                id: 'listId',
                name: 'listId',
                value: gitlabCred.config.testListId || '',
                type: 'string',
              },
              {
                id: 'isGroup',
                name: 'isGroup',
                value: true,
                type: 'boolean',
              },
              {
                id: 'assignee',
                name: 'assignee',
                value: '',
                type: 'string',
              },
              {
                id: 'first',
                name: 'first',
                value: 10,
                type: 'number',
              },
            ],
          },
          options: {},
        },
        id: 'set-test-data',
        name: 'Set Test Data',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [0, 504],
      },
      {
        parameters: {
          method: 'POST',
          url: `${serverUrl}/api/graphql`,
          authentication: 'predefinedCredentialType',
          nodeCredentialType: 'gitlabApi',
          sendBody: true,
          specifyBody: 'json',
          jsonBody: `={
  "query": ${JSON.stringify(graphqlQuery)},
  "variables": {
    "fullPath": "{{ $json.fullPath }}",
    "boardId": "{{ $json.boardId }}",
    "id": "{{ $json.listId }}",
    "isGroup": {{ $json.isGroup === true || $json.isGroup === 'true' }},
    "isProject": {{ $json.isGroup !== true && $json.isGroup !== 'true' }},
    "first": {{ $json.first || 10 }},
    "filters": {{ $json.assignee ? '{"assigneeUsername": "' + $json.assignee + '"}' : '{}' }}
  }
}`,
          options: {},
        },
        id: 'gitlab-graphql',
        name: 'GitLab GraphQL',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [0, 304],
        credentials: {
          gitlabApi: {
            id: 'gitlab-api-cred',
            name: 'GitLab API',
          },
        },
      },
      {
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'result',
                name: 'result',
                value:
                  '={{ JSON.stringify(($json.data?.group?.board?.lists?.nodes?.[0]?.issues?.nodes || $json.data?.project?.board?.lists?.nodes?.[0]?.issues?.nodes || []).map(item => ({ id: item.id, iid: item.iid, title: item.title, reference: item.referencePath, webUrl: item.webUrl, type: item.type, dueDate: item.dueDate, milestone: item.milestone?.title, assignees: item.assignees?.nodes?.map(a => a.username), labels: item.labels?.nodes?.map(l => l.title) }))) }}',
                type: 'string',
              },
            ],
          },
          options: {},
        },
        id: 'format-output',
        name: 'Format Output',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [200, 304],
      },
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'GitLab GraphQL', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
      },
      'Set Test Data': {
        main: [[{ node: 'GitLab GraphQL', type: 'main', index: 0 }]],
      },
      'GitLab GraphQL': {
        main: [[{ node: 'Format Output', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'freecode-tool-gitlab-board-issues',
    },
  }
}

export default createWorkflow()
