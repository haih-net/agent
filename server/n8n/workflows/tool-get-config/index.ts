import { WorkflowBase } from '../interfaces'

if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required')
}

const config = {
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
}

const configJson = JSON.stringify(config, null, 2)

const jsCode = `
const config = ${configJson};
return [{ json: config }];
`.trim()

const workflow: WorkflowBase = {
  name: 'Tool: Get Config',
  active: true,
  versionId: 'tool-get-config-v3',
  nodes: [
    {
      parameters: {
        inputSource: 'passthrough',
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
        jsCode,
      },
      id: 'get-config',
      name: 'Get Config',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [0, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Get Config', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Get Config', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-get-config',
  },
}

export default workflow
