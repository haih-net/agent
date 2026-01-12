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

const graphqlQuery = `query getWorkItems($fullPath: ID!, $state: IssuableState, $firstPageSize: Int, $assigneeUsernames: [String!], $types: [IssueType!]) {
  namespace(fullPath: $fullPath) {
    id
    name
    workItems(
      state: $state
      first: $firstPageSize
      assigneeUsernames: $assigneeUsernames
      types: $types
      sort: CREATED_DESC
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        iid
        title
        state
        webUrl
        createdAt
        updatedAt
        author {
          username
        }
        namespace {
          fullPath
        }
        workItemType {
          name
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
    name: 'Tool: GitLab Issues',
    active: true,
    versionId: 'tool-gitlab-issues-v1',
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'project',
                type: 'string',
              },
              {
                name: 'state',
                type: 'string',
              },
              {
                name: 'assignee',
                type: 'string',
              },
              {
                name: 'limit',
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
                id: 'project',
                name: 'project',
                value: gitlabCred.config.testRepo,
                type: 'string',
              },
              {
                id: 'state',
                name: 'state',
                value: 'opened',
                type: 'string',
              },
              {
                id: 'assignee',
                name: 'assignee',
                value: '',
                type: 'string',
              },
              {
                id: 'limit',
                name: 'limit',
                value: '10',
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
    "fullPath": "{{ $json.project }}",
    "state": "{{ $json.state || 'opened' }}",
    "firstPageSize": {{ $json.limit || 10 }},
    "assigneeUsernames": {{ $json.assignee ? '["' + $json.assignee + '"]' : 'null' }},
    "types": ["ISSUE", "TASK"]
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
                  '={{ JSON.stringify(($json.data?.namespace?.workItems?.nodes || []).map(item => ({ iid: item.iid, title: item.title, state: item.state, type: item.workItemType?.name, author: item.author?.username, project: item.namespace?.fullPath, url: item.webUrl, created_at: item.createdAt, updated_at: item.updatedAt }))) }}',
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
      instanceId: 'freecode-tool-gitlab-issues',
    },
  }
}

export default createWorkflow()
