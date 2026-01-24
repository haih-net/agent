import { NodeType } from '../../interfaces'
import { getReflexNode } from './reflex'
import { getReactionNode } from './reaction'

type GetEXNodesProps = {
  agentId: string
  agentName: string
}

export function getEXNodes({
  agentId,
  agentName,
}: GetEXNodesProps): NodeType[] {
  return [
    getReflexNode({ agentId, agentName }),
    getReactionNode({ agentId, agentName }),
  ]
}
