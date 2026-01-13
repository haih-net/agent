# Workflow Factory

The agent-factory system dynamically generates n8n workflows from TypeScript definitions.

## Location

```
server/n8n/workflows/
├── agent-factory/           # Core factory logic
│   ├── index.ts             # createAgent() function
│   ├── interfaces.ts        # AgentFactoryConfig type
│   └── nodes/
│       ├── baseNodes/       # Common nodes for all agents
│       └── mindLogNodes/    # MindLog tool nodes
├── helpers/                 # Tool creation helpers
│   └── index.ts             # createTool(), createAgentTool(), etc.
├── agent-chat/              # Chat Agent workflow
├── agent-gitlab/            # GitLab Agent workflow
├── agent-project-manager/   # Project Manager Agent
├── agent-pr-manager/        # PR Manager Agent
├── agent-web-search/        # Web Search Agent (Perplexity)
├── agent-marketing-director/ # Marketing Director Agent
└── agent-api/               # API Agent
```

## Related

- [Workflow Helpers](./helpers/README.md) — `createTool()`, `createAgentTool()` functions

## AgentFactoryConfig

```typescript
interface AgentFactoryConfig {
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
  
  // Optional
  model?: string                    // Default: 'anthropic/claude-sonnet-4'
  maxIterations?: number            // Default: 20
  memorySize?: number | false       // Default: 10, false to disable
  hasGraphqlTool?: boolean          // Default: true
  hasTools?: boolean                // Default: true
  hasWorkflowOutput?: boolean       // Default: true
  authFromToken?: boolean           // Default: false
  canExecuteCode?: boolean          // Default: false
  agentNodeType?: 'default' | 'orchestrator'  // Default: 'default'
  enableStreaming?: boolean         // Default: true
  additionalNodes?: NodeType[]
  additionalConnections?: ConnectionsType
  workflowInputs?: WorkflowInputValue[]
}
```

## Key Configuration Options

### hasTools

Controls whether tools are connected to the agent. Set to `false` for models that don't support tool calls (e.g., Perplexity Sonar).

When `hasTools: false`:
- No MindLog tools (Create, Search, Update)
- No Fetch MindLogs / Prepare MindLogs nodes
- Prepare Context connects directly to agent node

**Example:**
```typescript
const { agentWorkflow } = createAgent({
  agentName: 'Web Search Agent',
  model: 'perplexity/sonar-reasoning-pro',
  hasTools: false,      // Perplexity doesn't support tools
  hasGraphqlTool: false,
  memorySize: 0,        // No memory either
  // ...
})
```

### agentNodeType

- `'default'` — Uses standard n8n AI Agent node with Chat Model
- `'orchestrator'` — Uses custom AgentOrchestrator node with direct OpenAI SDK

### memorySize

Number of conversation turns to keep in memory. Set to `0` or `false` to disable memory.

### authFromToken

When `true`, adds "Get User By Token" node to authenticate users from JWT token in request.

## Creating a New Agent

1. Create folder: `server/n8n/workflows/agent-{name}/`
2. Create `index.ts`:

```typescript
import * as path from 'path'
import { createAgent } from '../agent-factory'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: 'My Agent',
  agentDescription: 'Description for tool use',
  agentId: 'my-agent',
  workflowName: 'Agent: My Agent',
  versionId: 'agent-my-v1',
  credentialId: 'freecode-agent-my-cred',
  credentialName: 'FreeCode API - agent-my',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-my-webhook',
  instanceId: 'narasim-dev-my-agent',
})

export default [toolGraphqlRequest, agentWorkflow]
```

3. Create `system-message.md` with agent instructions
4. Register in `server/n8n/workflows/index.ts`

## Agents Overview

| Agent | Model | hasTools | Description |
|-------|-------|----------|-------------|
| Chat Agent | claude-opus-4.5 | true | Main user interface, orchestrator |
| Project Manager | claude-sonnet-4 | true | Projects, tasks, team |
| PR Manager | claude-sonnet-4 | true | Content, publications |
| Web Search | perplexity/sonar-reasoning-pro | false | Internet search |
| Marketing Director | claude-sonnet-4 | true | Marketing strategy |
| API Agent | claude-sonnet-4 | true | GraphQL operations |

## Authentication-Only Agents

Some agents are restricted to authenticated users:
- **Web Search Agent** — Requires user authentication
- **Marketing Director Agent** — Requires user authentication

This is enforced in the Chat Agent's system message, not in the workflow itself.
