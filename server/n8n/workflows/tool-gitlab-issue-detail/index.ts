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

const graphqlQuery = `query namespaceWorkItem($fullPath: ID!, $iid: String!) {
  workspace: namespace(fullPath: $fullPath) {
    id
    workItem(iid: $iid) {
      id
      iid
      title
      state
      description
      confidential
      createdAt
      closedAt
      webUrl
      reference(full: true)
      namespace {
        id
        fullPath
        name
        fullName
        webUrl
      }
      author {
        id
        name
        username
        webUrl
      }
      workItemType {
        id
        name
        iconName
      }
      widgets {
        type
        ... on WorkItemWidgetAssignees {
          assignees {
            nodes {
              id
              name
              username
              webUrl
            }
          }
        }
        ... on WorkItemWidgetDescription {
          description
          descriptionHtml
          lastEditedAt
        }
        ... on WorkItemWidgetLabels {
          labels {
            nodes {
              id
              title
              color
              textColor
            }
          }
        }
        ... on WorkItemWidgetMilestone {
          milestone {
            id
            title
            state
            dueDate
          }
        }
        ... on WorkItemWidgetStartAndDueDate {
          dueDate
          startDate
        }
        ... on WorkItemWidgetTimeTracking {
          timeEstimate
          totalTimeSpent
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
    name: 'Tool: GitLab Issue Detail',
    active: true,
    versionId: 'tool-gitlab-issue-detail-v1',
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
                name: 'iid',
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
                value: gitlabCred.config.testRepo,
                type: 'string',
              },
              {
                id: 'iid',
                name: 'iid',
                value: gitlabCred.config.testIssueIid || '1',
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
    "iid": "{{ $json.iid }}"
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
                  '={{ (() => { const item = $json.data?.workspace?.workItem; if (!item) return "{}"; const assignees = item.widgets?.find(w => w.type === "ASSIGNEES")?.assignees?.nodes || []; const labels = item.widgets?.find(w => w.type === "LABELS")?.labels?.nodes || []; const milestone = item.widgets?.find(w => w.type === "MILESTONE")?.milestone; const dates = item.widgets?.find(w => w.type === "START_AND_DUE_DATE"); const time = item.widgets?.find(w => w.type === "TIME_TRACKING"); return JSON.stringify({ iid: item.iid, title: item.title, state: item.state, description: item.description, confidential: item.confidential, url: item.webUrl, reference: item.reference, project: item.namespace?.fullPath, author: item.author?.username, type: item.workItemType?.name, createdAt: item.createdAt, closedAt: item.closedAt, assignees: assignees.map(a => a.username), labels: labels.map(l => ({ title: l.title, color: l.color })), milestone: milestone ? { title: milestone.title, state: milestone.state, dueDate: milestone.dueDate } : null, startDate: dates?.startDate, dueDate: dates?.dueDate, timeEstimate: time?.timeEstimate, totalTimeSpent: time?.totalTimeSpent }); })() }}',
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
      instanceId: 'freecode-tool-gitlab-issue-detail',
    },
  }
}

export default createWorkflow()
