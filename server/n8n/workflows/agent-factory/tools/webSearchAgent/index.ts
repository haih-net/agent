import { createAgentTool } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'
import { getNodeCoordinates } from '../../../helpers/nodeCoordinates'

interface WebSearchAgentToolsConfig {
  agentId: string
  agentName: string
}

export function getWebSearchAgentNodes(
  config: WebSearchAgentToolsConfig,
): NodeType[] {
  const { agentId } = config

  return [
    createAgentTool({
      name: 'web_search_agent',
      toolName: 'Web Search Agent Tool',
      description:
        'Delegate web search and research tasks. Use for: internet search, current information, fact-checking, news, fetching web pages. ONLY FOR AUTHENTICATED USERS.',
      workflowName: 'Agent: Web Search',
      nodeId: `${agentId}-tool-web-search-agent`,
      position: getNodeCoordinates('tool-web-search-agent'),
    }),
  ]
}

export function getWebSearchAgentConnections(
  config: WebSearchAgentToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Web Search Agent Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}
