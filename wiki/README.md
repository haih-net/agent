# Agent Documentation

## Contents

- [Technical Overview](./technical-overview.md) — stack, architecture, configuration, manual setup
- [Registration Policy](./registration-policy.md) — referral system, user statuses
- [Code Style](./code-style.md)
- [Custom Nodes](./custom-nodes/README.md)
- [Workflows](./workflows/README.md)
- [Testing](./testing/README.md)
- [Mail Server](./mailserver/README.md)
- [World3D](./world3d/README.md) — multiplayer 3D environment

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
- **ToolCallsMemory** — In-memory storage for tool execution history

## Workflow Factory

Located in `server/n8n/workflows/agent-factory/`:
- Generates n8n workflows from TypeScript
- `hasTools` flag for models without tool support
