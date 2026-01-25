import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Tool: Fetch Request',
  active: true,
  versionId: 'tool-fetch-request-v2',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'url',
              type: 'string',
            },
            {
              name: 'method',
              type: 'string',
            },
            {
              name: 'headers',
              type: 'string',
            },
            {
              name: 'body',
              type: 'string',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('tool-fetch-request-trigger'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-fetch-request-manual'),
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
              id: 'url',
              name: 'url',
              value: 'https://kms-agent.ai/api',
              type: 'string',
            },
            {
              id: 'method',
              name: 'method',
              value: 'POST',
              type: 'string',
            },
            {
              id: 'headers',
              name: 'headers',
              value:
                '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiY21rbXFzNXN6MDAycWxiMHB1YWh4M3VwOSIsInVzZXJJZCI6ImNta21xajIxajAwMm9sYjBwOTA0NTdxY2siLCJpYXQiOjE3Njg5MjI0OTZ9.kHO6o5zFPJoikrfLoBwnY3BD95XDzW9BMOMER0sUH6I"}',
              type: 'string',
            },
            {
              id: 'body',
              name: 'body',
              value: `{"query": "query me { me { id, username, fullname  }}"}`,
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
      position: getNodeCoordinates('tool-fetch-request-set-test'),
    },
    {
      parameters: {
        method: '={{ $json.method }}',
        url: '={{ $json.url }}',
        sendHeaders: true,
        specifyHeaders: 'json',
        jsonHeaders: '={{ $json.headers || "{}" }}',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: '={{ $json.body || "{}" }}',
        options: {
          response: {
            response: {
              fullResponse: true,
            },
          },
        },
      },
      id: 'http-request',
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: getNodeCoordinates('tool-fetch-request-http'),
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Data', type: 'main', index: 0 }]],
    },
    'Set Test Data': {
      main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-fetch-request',
  },
}

export default workflow
