import { NodeType } from '../../interfaces'
import { getConceptNode } from './concept'
import { getFactNode } from './fact'
import { getFactParticipationNode } from './factParticipation'
import { getFactProjectionNode } from './factProjection'
import { getKnowledgeSpaceNode } from './knowledgeSpace'

type GetKBNodesProps = {
  agentId: string
  agentName: string
}

export function getKBNodes({
  agentId,
  agentName,
}: GetKBNodesProps): NodeType[] {
  return [
    getConceptNode({ agentId, agentName }),
    getFactNode({ agentId, agentName }),
    getFactParticipationNode({ agentId, agentName }),
    getFactProjectionNode({ agentId, agentName }),
    getKnowledgeSpaceNode({ agentId, agentName }),
  ]
}
