import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface FetchRequestToolsConfig {
  agentId: string
  agentName: string
}

export function getFetchRequestNodes(
  config: FetchRequestToolsConfig,
): NodeType[] {
  const { agentId } = config

  return [
    createTool({
      name: 'fetch_request',
      toolName: 'Fetch Request Tool',
      description:
        'Execute HTTP request using fetch. Only external URLs allowed (no localhost/internal IPs). Returns status, statusText and body (JSON auto-parsed).',
      workflowName: 'Tool: Fetch Request',
      nodeId: `${agentId}-tool-fetch`,
      position: getNodeCoordinates('tool-fetch'),
      inputs: createToolInputs([
        {
          name: 'url',
          description:
            'Full URL starting with http:// or https://, e.g. https://api.example.com/data',
          type: 'string',
          required: true,
        },
        {
          name: 'method',
          description:
            'HTTP method: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
          type: 'string',
          required: true,
        },
        {
          name: 'headers',
          description:
            'Request headers as JSON string, e.g. {"Content-Type": "application/json", "Authorization": "Bearer token"}',
          type: 'string',
        },
        {
          name: 'body',
          description:
            'Request body as JSON string for POST/PUT/PATCH requests',
          type: 'string',
        },
      ]),
    }),
  ]
}

export function getFetchRequestConnections(
  config: FetchRequestToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Fetch Request Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}
