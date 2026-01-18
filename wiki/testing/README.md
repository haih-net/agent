# Testing & Debugging

Guide for testing and debugging the n8n integration.

## Debug Logging

AgentOrchestrator outputs debug logs during streaming:

```
[DEBUG] Starting agent loop. Tools available: 6, toolChoice: auto
[DEBUG] Tools: PR_Manager_Agent_Tool, Project_Manager_Agent_Tool, ...
[DEBUG] Iteration 1/20
[DEBUG] LLM response received. Content length: 54, thinking length: 0, tool_calls: 3
[DEBUG] Extracted tool calls: 3
[DEBUG] Executing tool: Project_Manager_Agent_Tool with args: {...}
[DEBUG] executeTool: Found 6 tools: ...
[DEBUG] executeTool: Invoking Project_Manager_Agent_Tool with args: {...}
[DEBUG] Tool Project_Manager_Agent_Tool result: ...
```

## Testing via curl

### Basic request

```bash
curl -X POST http://localhost:5678/webhook/agent-chat-webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Привет!", "sessionId": "test-123"}'
```

### With debug output

```bash
curl -s -X POST http://localhost:5678/webhook/agent-chat-webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Поздоровайся со всеми агентами", "sessionId": "test-456"}' \
  | grep -E "DEBUG"
```

## Execution Export

Export n8n executions for analysis:

```bash
cd scripts/analyze-agent-results
./export-executions.sh
# Output: executions-export.md
```

## n8n UI

Access n8n directly at `http://localhost:5678`:
- View workflow executions
- Check node outputs
- Debug tool calls

## Type Checking

```bash
# Check all types (includes custom-nodes)
npm run types

# Lint
npm run lint
```

## Common Debug Scenarios

### Agent not calling tools

1. Check debug log: "Tools available: X"
2. Verify tools are connected in workflow
3. Check system message — does it instruct to use tools?

### Tool execution fails

1. Check debug log: "executeTool: Found X tools"
2. Verify tool name matches
3. Check tool arguments parsing

### Infinite loop

1. Check iteration count in debug logs
2. Verify LLM eventually returns `tool_calls: 0`
3. Check maxIterations parameter

### Streaming not working

1. Verify `enableStreaming: true` in options
2. Check `ctx.isStreaming()` returns true
3. Verify webhook mode (not test mode)

## Rebuild Cycle

After code changes:

```bash
# 1. Build custom nodes
npm run build:custom-nodes

# 2. Rebuild server
npm run build

# 3. Restart (user does this)
# npm run start
```

## Files to Check

| Issue | File |
|-------|------|
| LLM calls | `helpers/callLLM.ts` |
| Tool execution | `helpers/executeTool.ts` |
| Main loop | `helpers/executeFullMode.ts` |
| Tool parsing | `helpers/extractToolCalls.ts` |
| Workflow generation | `workflows/agent-factory/` |
