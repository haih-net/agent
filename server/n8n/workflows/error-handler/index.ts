import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Error Handler',
  active: true,
  versionId: 'error-handler-v1',
  nodes: [
    {
      parameters: {},
      id: 'error-trigger',
      name: 'Error Trigger',
      type: 'n8n-nodes-base.errorTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('error-handler-trigger'),
    },
    {
      parameters: {
        assignments: {
          assignments: [
            {
              id: 'error-info',
              name: 'errorMessage',
              value: '={{ $json.execution.error.message }}',
            },
            {
              id: 'workflow-name',
              name: 'workflowName',
              value: '={{ $json.workflow.name }}',
            },
            {
              id: 'workflow-id',
              name: 'workflowId',
              value: '={{ $json.workflow.id }}',
            },
            {
              id: 'execution-id',
              name: 'executionId',
              value: '={{ $json.execution.id }}',
            },
            {
              id: 'timestamp',
              name: 'timestamp',
              value: '={{ $now.toISO() }}',
            },
            {
              id: 'node-name',
              name: 'failedNode',
              value: '={{ $json.execution.lastNodeExecuted }}',
            },
          ],
        },
        options: {},
      },
      id: 'set-error-data',
      name: 'Format Error Data',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('error-handler-set-data'),
    },
    {
      parameters: {
        content:
          '## Error Report\n\n**Workflow:** {{ $json.workflowName }} (ID: {{ $json.workflowId }})\n\n**Execution ID:** {{ $json.executionId }}\n\n**Failed Node:** {{ $json.failedNode }}\n\n**Timestamp:** {{ $json.timestamp }}\n\n**Error Message:**\n```\n{{ $json.errorMessage }}\n```',
        height: 400,
        width: 400,
      },
      id: 'sticky-note',
      name: 'Error Details',
      type: 'n8n-nodes-base.stickyNote',
      typeVersion: 1,
      position: getNodeCoordinates('error-handler-sticky-note'),
    },
    {
      parameters: {},
      id: 'no-op',
      name: 'Log Error',
      type: 'n8n-nodes-base.noOp',
      typeVersion: 1,
      position: getNodeCoordinates('error-handler-log'),
      notesInFlow: true,
      notes:
        'Replace this with your notification node (Slack, Email, Telegram, etc.)',
    },
  ],
  connections: {
    'Error Trigger': {
      main: [[{ node: 'Format Error Data', type: 'main', index: 0 }]],
    },
    'Format Error Data': {
      main: [[{ node: 'Log Error', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    templateCredsSetupCompleted: true,
    instanceId: 'narasim-dev',
  },
}

export default workflow
