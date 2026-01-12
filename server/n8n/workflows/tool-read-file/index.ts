import { WorkflowBase } from '../interfaces'

const workflow: WorkflowBase = {
  name: 'Tool: Read File',
  active: true,
  versionId: 'tool-read-file-v2',
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
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'path',
              name: 'path',
              value: 'src/gql/generated/types.ts',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-test-path',
      name: 'Set Test Path',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [0, 504],
    },
    {
      parameters: {
        command: '=cat {{ $json.path }} 2>&1 | head -500',
      },
      id: 'exec-read',
      name: 'Read File',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: [200, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Read File', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Path', type: 'main', index: 0 }]],
    },
    'Set Test Path': {
      main: [[{ node: 'Read File', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-read-file',
  },
}

export default workflow
