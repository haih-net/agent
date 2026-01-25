import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Tool: Verify Token',
  active: true,
  versionId: 'verify-token-v1',
  nodes: [
    {
      parameters: {},
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('verify-token-trigger'),
    },
    {
      parameters: {
        method: 'POST',
        url: "={{ $env.APP_URL || 'http://localhost:3000' }}/api",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: 'Content-Type',
              value: 'application/json',
            },
            {
              name: 'Authorization',
              value: '=Bearer {{ $json.token }}',
            },
          ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
          "={{ JSON.stringify({ query: '{ me { id username fullname } }' }) }}",
        options: {
          response: {
            response: {
              responseFormat: 'json',
            },
          },
        },
      },
      id: 'graphql-request',
      name: 'GraphQL Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: getNodeCoordinates('verify-token-graphql'),
    },
    {
      parameters: {
        assignments: {
          assignments: [
            {
              id: 'user',
              name: 'user',
              value: '={{ $json.data?.me }}',
              type: 'object',
            },
            {
              id: 'isValid',
              name: 'isValid',
              value: '={{ !!$json.data?.me }}',
              type: 'boolean',
            },
          ],
        },
        options: {},
      },
      id: 'set-output',
      name: 'Set Output',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('verify-token-set-output'),
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'GraphQL Request', type: 'main', index: 0 }]],
    },
    'GraphQL Request': {
      main: [[{ node: 'Set Output', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-knowledge',
  },
}

export default workflow
