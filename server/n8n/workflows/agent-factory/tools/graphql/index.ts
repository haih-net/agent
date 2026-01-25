import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface GraphqlToolsConfig {
  agentId: string
  agentName: string
}

export function getGraphqlToolNodes(config: GraphqlToolsConfig): NodeType[] {
  const { agentId, agentName } = config

  return [
    createTool({
      name: 'graphql_request',
      toolName: 'GraphQL Request Tool',
      description: `Execute a GraphQL query or mutation against the API. IMPORTANT: All requests are authenticated as ${agentName}, not as the external user.`,
      workflowName: `Tool: GraphQL Request (${agentName})`,
      nodeId: `${agentId}-tool-graphql`,
      position: getNodeCoordinates('tool-graphql'),
      inputs: createToolInputs([
        {
          name: 'query',
          description: 'Required! GraphQL query or mutation string',
          type: 'string',
          required: true,
        },
        {
          name: 'variables',
          description:
            'Variables object for the query, use {} if no variables needed',
          type: 'string',
          required: true,
        },
        {
          name: 'operationName',
          description:
            'Optional: GraphQL operation name to execute specific operation from document',
          type: 'string',
        },
      ]),
    }),
  ]
}

export function getGraphqlToolConnections(
  config: GraphqlToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'GraphQL Request Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}
