# n8n FreeCode Project Documentation

This documentation covers the custom n8n integration for freecode.academy.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Custom Nodes](./custom-nodes/README.md)
- [Agent System](./agents/README.md)
- [Workflows](./workflows/README.md)
- [Helpers](./helpers/README.md)
- [Testing & Debugging](./testing/README.md)

## Architecture Overview

The project integrates n8n as a workflow automation engine with custom extensions:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                            │
│  ├── GraphQL API (Pothos + Prisma)                          │
│  └── n8n Integration (embedded module)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         n8n                                  │
│  ├── Custom Nodes (AgentOrchestrator, StreamTest)           │
│  ├── Dynamic Workflows (agent-factory)                       │
│  └── System Credentials (OpenRouter API)                     │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### Custom Nodes
Located in `server/n8n/custom-nodes/`:
- **AgentOrchestrator** — Main AI agent node with direct OpenAI SDK integration
- **StreamTest** — Testing node for streaming capabilities

### Workflow Factory
Located in `server/n8n/workflows/agent-factory/`:
- Dynamically generates n8n workflows from TypeScript definitions
- Supports multiple agent types (default, orchestrator)
- Manages tool connections and credentials
- `hasTools` flag — disable all tools for models that don't support them (e.g., Perplexity)

### Agent System
Multi-agent architecture with specialized agents:
- **Chat Agent** — Main user interface, delegates to specialized agents
- **Project Manager Agent** — Project and task management
- **PR Manager Agent** — Content and publications
- **Web Search Agent** — Internet search using Perplexity Sonar (authenticated users only)
- **Marketing Director Agent** — Marketing strategy and research (authenticated users only)
- **API Agent** — GraphQL operations (last resort)

## Quick Start

```bash
# Development
npm run dev:n8n

# Build
npm run build

# Production
npm run start
```

## n8n Source Code

Original n8n source code is located at `/www/n8n/n8n` for reference when debugging or extending functionality.

## Related Documentation

- [Custom Nodes Development](./custom-nodes/README.md)
- [Agent Orchestrator Deep Dive](./custom-nodes/agent-orchestrator.md)
- [Testing Guide](./testing/README.md)
