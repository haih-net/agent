# Custom Nodes

## Location

```
server/n8n/custom-nodes/
├── src/nodes/
│   └── AgentOrchestrator/    # Main AI agent node
├── package.json
└── tsconfig.json
```

## AgentOrchestrator

Full AI agent with tool execution loop. See [detailed documentation](./agent-orchestrator.md).

- Direct OpenAI SDK integration
- Streaming support
- Multi-iteration tool execution
- Credentials: `openRouterApi`

## Development

```bash
cd server/n8n/custom-nodes && npm run build
```
