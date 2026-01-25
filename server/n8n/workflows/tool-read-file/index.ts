import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

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
      position: getNodeCoordinates('tool-read-file-trigger'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-read-file-manual'),
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
      position: getNodeCoordinates('tool-read-file-set-test'),
    },
    {
      parameters: {
        command: '=cat {{ $json.path }} 2>&1 | head -500',
      },
      id: 'exec-read',
      name: 'Read File',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: getNodeCoordinates('tool-read-file-execute'),
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
