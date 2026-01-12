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

const graphqlQuery = `query BoardLists($fullPath: ID!, $boardId: BoardID!, $isGroup: Boolean = false, $isProject: Boolean = false, $filters: BoardIssueInput) {
  group(fullPath: $fullPath) @include(if: $isGroup) {
    id
    board(id: $boardId) {
      id
      hideBacklogList
      lists(issueFilters: $filters) {
        nodes {
          id
          title
          position
          listType
          collapsed
          label {
            id
            title
            color
            textColor
          }
        }
      }
    }
  }
  project(fullPath: $fullPath) @include(if: $isProject) {
    id
    board(id: $boardId) {
      id
      hideBacklogList
      lists(issueFilters: $filters) {
        nodes {
          id
          title
          position
          listType
          collapsed
          label {
            id
            title
            color
            textColor
          }
        }
      }
    }
  }
}`

function createWorkflow(): WorkflowBase | null {
  if (!gitlabCred) {
    return null
  }

  return {
    name: 'Tool: GitLab Board Lists',
    active: true,
    versionId: 'tool-gitlab-board-lists-v1',
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
                name: 'isGroup',
                type: 'boolean',
              },
              {
                name: 'assignee',
                type: 'string',
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
    "isGroup": {{ $json.isGroup === true || $json.isGroup === 'true' }},
    "isProject": {{ $json.isGroup !== true && $json.isGroup !== 'true' }},
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
                  '={{ JSON.stringify(($json.data?.group?.board?.lists?.nodes || $json.data?.project?.board?.lists?.nodes || []).map(item => ({ id: item.id, title: item.title, position: item.position, listType: item.listType, collapsed: item.collapsed, label: item.label ? { title: item.label.title, color: item.label.color } : null }))) }}',
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
      instanceId: 'freecode-tool-gitlab-board-lists',
    },
  }
}

export default createWorkflow()
