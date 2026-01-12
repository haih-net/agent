# Workflow Factory

Generates n8n workflows from TypeScript definitions.

## Location

```
server/n8n/workflows/
├── agent-factory/           # Core factory logic
├── agent-chat/              # Chat Agent
└── agent-web-search/        # Web Search Agent (Perplexity)
```

## Key Options

- `hasTools` — disable for models without tool support (e.g., Perplexity)
- `agentNodeType` — `'orchestrator'` for custom AgentOrchestrator node
- `memorySize` — conversation memory size, `0` to disable
- `authFromToken` — authenticate users from JWT token

## Agents

| Agent | Model | hasTools |
|-------|-------|----------|
| Chat Agent | claude-opus-4.5 | true |
| Web Search | perplexity/sonar-reasoning-pro | false |

## Creating a New Agent

1. Create `server/n8n/workflows/agent-{name}/`
2. Create `index.ts` with `createAgent()` config
3. Create `system-message.md`
