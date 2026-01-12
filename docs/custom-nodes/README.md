# Custom Nodes

Custom n8n nodes for the FreeCode project.

## Location

```
server/n8n/custom-nodes/
├── src/
│   ├── helpers/
│   │   └── types.ts          # Shared types (ExecuteContext, etc.)
│   └── nodes/
│       ├── AgentOrchestrator/ # Main AI agent node
│       └── StreamTest/        # Streaming test node
├── package.json
└── tsconfig.json
```

## Available Nodes

### AgentOrchestrator

Full AI agent with tool execution loop. See [detailed documentation](./agent-orchestrator.md).

**Key features:**
- Direct OpenAI SDK integration (not n8n Chat Model)
- Streaming support with debug logging
- Multi-iteration tool execution loop
- Credentials: `openRouterApi`

### StreamTest

Simple node for testing streaming capabilities.

## Development

```bash
# Build custom nodes
npm run build:custom-nodes

# Watch mode
npm run watch:custom-nodes
```

## Registration

Nodes are registered in `package.json`:

```json
{
  "n8n": {
    "nodes": [
      "dist/nodes/AgentOrchestrator/AgentOrchestrator.node.js",
      "dist/nodes/StreamTest/StreamTest.node.js"
    ]
  }
}
```

## Credentials

Custom nodes can use n8n credentials via `this.getCredentials()`:

```typescript
const credentials = await ctx.getCredentials('openRouterApi')
// Returns: { apiKey: string, url: string }
```

See [credentials documentation](../../project/tests/003--custom-credentials/README.md) for details.
