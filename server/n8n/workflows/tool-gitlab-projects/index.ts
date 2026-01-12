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

function createWorkflow(): WorkflowBase | null {
  if (!gitlabCred) {
    return null
  }

  return {
    name: 'Tool: GitLab Projects',
    active: true,
    versionId: 'tool-gitlab-projects-v1',
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'limit',
                type: 'number',
              },
              {
                name: 'page',
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
                id: 'limit',
                name: 'limit',
                value: '10',
                type: 'number',
              },
              {
                id: 'page',
                name: 'page',
                value: '1',
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
          method: 'GET',
          url: `=${serverUrl}/api/v4/projects?membership=true&per_page={{ $json.limit || 10 }}&page={{ $json.page || 1 }}`,
          authentication: 'predefinedCredentialType',
          nodeCredentialType: 'gitlabApi',
          options: {},
        },
        id: 'gitlab-get-repos',
        name: 'GitLab Get Projects',
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
                  '={{ JSON.stringify($input.all().map(item => ({ id: item.json.id, name: item.json.name, path: item.json.path_with_namespace, url: item.json.web_url }))) }}',
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
        main: [[{ node: 'GitLab Get Projects', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
      },
      'Set Test Data': {
        main: [[{ node: 'GitLab Get Projects', type: 'main', index: 0 }]],
      },
      'GitLab Get Projects': {
        main: [[{ node: 'Format Output', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: 'freecode-tool-gitlab-projects',
    },
  }
}

export default createWorkflow()
