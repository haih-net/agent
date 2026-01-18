# Workflow Helpers

Helper functions for creating standardized tool nodes in n8n workflows.

## Location

```
server/n8n/workflows/helpers/index.ts
```

## Functions

| Function | Purpose |
|----------|---------|
| `createTool()` | Base function for creating tool nodes |
| `createToolInputs()` | Generate AI-driven inputs with `$fromAI()` |
| `createStaticInputs()` | Generate static/hardcoded inputs |
| `createAgentTool()` | Create agent-to-agent delegation tools |

## createTool

Base function for creating `toolWorkflow` nodes with standardized structure.

### Interface

```typescript
interface CreateToolConfig {
  name: string              // Tool name for AI (snake_case)
  toolName: string          // Node display name
  description: string       // Tool description for AI
  workflowName: string      // Target workflow name
  nodeId: string            // Unique node ID
  position: [number, number] // Canvas position [x, y]
  inputs?: {
    value: Record<string, string>
    schema: SchemaItem[]
  }
}
```

### Example

```typescript
import { createTool, createToolInputs } from '../helpers'

createTool({
  name: 'gitlab_get_projects',
  toolName: 'GitLab Get Projects Tool',
  description: 'Get list of GitLab projects.',
  workflowName: 'Tool: GitLab Projects',
  nodeId: `${agentId}-tool-gitlab-projects`,
  position: [672, 720],
  inputs: createToolInputs([
    { name: 'limit', description: 'Number of projects', type: 'number' },
    { name: 'page', description: 'Page number', type: 'number' },
  ]),
})
```

## createToolInputs

Generates inputs with `$fromAI()` expressions for AI-driven parameter extraction.

### Interface

```typescript
interface ToolInputDef {
  name: string        // Parameter name
  description: string // Description for AI
  type: InputType     // 'string' | 'number' | 'boolean' | 'object'
  required?: boolean  // Default: false
}
```

### Example

```typescript
createToolInputs([
  {
    name: 'project',
    description: 'Project path in format owner/repo (required)',
    type: 'string',
    required: true,
  },
  {
    name: 'state',
    description: 'Issue state: opened, closed, all',
    type: 'string',
  },
])
```

**Generated output:**
```typescript
{
  value: {
    project: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('project', `Project path...`, 'string') }}",
    state: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('state', `Issue state...`, 'string') }}",
  },
  schema: [
    { id: 'project', displayName: 'project', required: true, type: 'string', ... },
    { id: 'state', displayName: 'state', required: false, type: 'string', ... },
  ]
}
```

## createStaticInputs

Generates inputs with static/hardcoded values.

### Interface

```typescript
interface StaticInputDef {
  name: string      // Parameter name
  value: string     // Static value or expression
  type: InputType   // 'string' | 'number' | 'boolean' | 'object'
  required?: boolean
}
```

### Example

```typescript
createStaticInputs([
  { name: 'path', value: 'src/gql/generated', type: 'string', required: true },
])
```

**With expression:**
```typescript
createStaticInputs([
  {
    name: 'path',
    value: "={{ 'src/gql/generated/' + $fromAI('filename', `Filename`, 'string') }}",
    type: 'string',
    required: true,
  },
])
```

## createAgentTool

Creates tool nodes for agent-to-agent delegation. Extends `createTool()` with:
- `chatInput` — Message to target agent (AI-generated)
- `sessionId` — Session ID from context
- `user` — User object (optional)

### Interface

```typescript
interface CreateAgentToolConfig {
  name: string              // Tool name for AI (snake_case)
  toolName: string          // Node display name
  description: string       // Tool description for AI
  workflowName: string      // Target agent workflow name
  nodeId: string            // Unique node ID
  position: [number, number]
  includeUser?: boolean     // Include user object, default: true
}
```

### Example

```typescript
import { createAgentTool } from '../helpers'

createAgentTool({
  name: 'gitlab_agent',
  toolName: 'GitLab Agent Tool',
  description: 'Get project information from GitLab.',
  workflowName: 'Agent: GitLab',
  nodeId: 'tool-gitlab-agent',
  position: [448, 512],
})
```

## Naming Conventions

| Field | Convention | Example |
|-------|------------|---------|
| `name` | snake_case | `gitlab_get_projects` |
| `toolName` | Title Case + "Tool" | `GitLab Get Projects Tool` |
| `workflowName` | "Tool: " or "Agent: " prefix | `Tool: GitLab Projects` |
| `nodeId` | kebab-case with agent prefix | `gitlab-agent-tool-projects` |

## Usage in Agents

### GitLab Agent (multiple tools)

```typescript
const gitlabToolNodes = [
  createTool({
    name: 'gitlab_get_projects',
    toolName: 'GitLab Get Projects Tool',
    workflowName: 'Tool: GitLab Projects',
    // ...
  }),
  createTool({
    name: 'gitlab_get_issues',
    toolName: 'GitLab Get Issues Tool',
    workflowName: 'Tool: GitLab Issues',
    // ...
  }),
]

const agentToolNodes = [
  createAgentTool({
    name: 'techlead_agent',
    toolName: 'Tech Lead Tool',
    workflowName: 'Agent: Tech Lead',
    // ...
  }),
]
```

### Connections

Tool names in `additionalConnections` must match `toolName`:

```typescript
additionalConnections: {
  'GitLab Get Projects Tool': {
    ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
  },
  'Tech Lead Tool': {
    ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
  },
}
```
