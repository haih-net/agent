import { WorkflowBase } from '../interfaces'

const jsCode = `
const now = new Date().toISOString();
const iteration = $input.first()?.json?.iteration || 1;

console.log(\`[Loop Handler] Iteration \${iteration} completed at \${now}\`);

return [{
  json: {
    status: 'completed',
    iteration,
    timestamp: now
  }
}];
`.trim()

const workflow: WorkflowBase = {
  name: 'Loop: Handler',
  active: true,
  versionId: 'loop-handler-v1',
  nodes: [
    {
      parameters: {
        inputSource: 'passthrough',
      },
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [0, 300],
      id: 'loop-handler-trigger',
      name: 'Execute Workflow Trigger',
    },
    {
      parameters: {
        amount: 10,
        unit: 'seconds',
      },
      type: 'n8n-nodes-base.wait',
      typeVersion: 1.1,
      position: [220, 300],
      id: 'loop-handler-wait',
      name: 'Wait 10s (simulate work)',
    },
    {
      parameters: {
        jsCode,
      },
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [440, 300],
      id: 'loop-handler-code',
      name: 'Process',
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Wait 10s (simulate work)', type: 'main', index: 0 }]],
    },
    'Wait 10s (simulate work)': {
      main: [[{ node: 'Process', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-loop-handler',
  },
}

export default workflow
