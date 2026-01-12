# Testing & Debugging

## Testing via curl

```bash
curl -X POST http://localhost:5678/webhook/agent-chat-webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Hello", "sessionId": "test-123"}'
```

## n8n UI

Access at `http://localhost:5678` to view executions and debug.

## Rebuild

```bash
cd server/n8n/custom-nodes && npm run build
npm run build
```

## Common Issues

- **Agent not calling tools** — check tools connected in workflow
- **Tool execution fails** — check tool name matches
- **Infinite loop** — check maxIterations parameter
