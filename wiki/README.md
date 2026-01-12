# n8n Integration Documentation

## Contents

- [Code Style](./code-style.md)
- [Custom Nodes](./custom-nodes/README.md)
- [Workflows](./workflows/README.md)
- [Testing](./testing/README.md)

## Architecture

```
Express Server
├── GraphQL API (Pothos + Prisma)
└── n8n Integration
    ├── Custom Nodes (AgentOrchestrator)
    └── Workflows (agent-factory)
```

## Agents

- **Chat Agent** — Main user interface
- **Web Search Agent** — Internet search (Perplexity, authenticated users only)

## Custom Nodes

Located in `server/n8n/custom-nodes/`:
- **AgentOrchestrator** — AI agent with OpenAI SDK integration

## Workflow Factory

Located in `server/n8n/workflows/agent-factory/`:
- Generates n8n workflows from TypeScript
- `hasTools` flag for models without tool support
