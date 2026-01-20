import { WorkflowBase } from '../interfaces'

export type NodeType = WorkflowBase['nodes'][number]
export type ConnectionsType = WorkflowBase['connections']

export interface WorkflowInputValue {
  name: string
  type?: 'string' | 'object' | 'number' | 'boolean' | 'any'
  default?: string | number | boolean
}

export interface AgentFactoryConfig {
  agentName: string
  agentDescription: string
  agentId: string
  workflowName: string
  versionId: string
  credentialId: string
  credentialName: string
  systemMessagePath: string
  webhookId: string
  instanceId: string
  workflowInputs?: WorkflowInputValue[]
  hasWorkflowOutput?: boolean
  model?: string
  maxIterations?: number
  memorySize?: number | false
  canAccessFileSystem?: boolean
  canExecuteFetch?: boolean
  authFromToken?: boolean
  hasGraphqlTool?: boolean
  hasTools?: boolean
  hasWebSearchAgent?: boolean
  additionalNodes?: NodeType[]
  additionalConnections?: ConnectionsType
  agentNodeType?: 'default' | 'orchestrator'
  /**
   * Enable streaming responses.
   * WARNING: When enableStreaming=false, agent executes correctly but returns empty response.
   * This is a known n8n issue with response waiting — affects both custom and native AI Agent nodes.
   */
  enableStreaming?: boolean
}

export interface AgentFactoryResult {
  toolGraphqlRequest: WorkflowBase
  agentWorkflow: WorkflowBase
}
