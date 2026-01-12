# AgentOrchestrator Node

The main AI agent node with full control over LLM interactions.

## Overview

AgentOrchestrator replaces the standard n8n Agent node with direct OpenAI SDK integration, providing:
- Full control over request/response cycle
- Streaming with debug logging
- Tool execution loop with iteration limits
- Support for "thinking" blocks (Claude extended thinking)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentOrchestrator                         │
├─────────────────────────────────────────────────────────────┤
│  Inputs:                                                     │
│  ├── main (chatInput, sessionId, user data)                 │
│  └── ai_tool (connected tools)                              │
├─────────────────────────────────────────────────────────────┤
│  Parameters:                                                 │
│  ├── mode: full | validator | nested                        │
│  ├── model: anthropic/claude-sonnet-4 (default)             │
│  └── options: systemMessage, maxIterations, etc.            │
├─────────────────────────────────────────────────────────────┤
│  Credentials:                                                │
│  └── openRouterApi (apiKey, url)                            │
└─────────────────────────────────────────────────────────────┘
```

## Execution Flow

### Full Mode (default)

```
1. Get credentials and model from node parameters
2. Build messages array (system + user + memory)
3. Get connected tools
4. Start iteration loop (max 20 by default):
   a. Call LLM with messages and tools
   b. Stream content to frontend
   c. Extract tool calls from response
   d. If no tool calls → break loop
   e. Execute each tool
   f. Add tool results to messages
   g. Continue loop
5. Save to memory
6. Return final output
```

## Key Files

```
server/n8n/custom-nodes/src/nodes/AgentOrchestrator/
├── AgentOrchestrator.node.ts  # Node definition
└── helpers/
    ├── callLLM.ts             # OpenAI SDK integration
    ├── executeFullMode.ts     # Main execution logic
    ├── executeValidatorMode.ts # Validator mode
    ├── executeTool.ts         # Tool execution
    ├── extractToolCalls.ts    # Parse tool calls from response
    ├── buildMessages.ts       # Message array construction
    ├── getConnectedTools.ts   # Get tools from ai_tool input
    ├── getMemoryMessages.ts   # Memory integration
    └── types.ts               # Local type definitions
```

## callLLM Implementation

Uses OpenAI SDK directly instead of n8n's Chat Model abstraction:

```typescript
import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: credentials.url || 'https://openrouter.ai/api/v1',
  apiKey: credentials.apiKey,
})

const stream = await client.chat.completions.create({
  model,
  messages,
  tools,
  tool_choice: toolChoice,
  stream: true,
})
```

### Streaming Tool Calls

Tool calls arrive in chunks during streaming. Arguments are accumulated:

```typescript
for await (const chunk of stream) {
  if (delta?.tool_calls) {
    for (const tc of delta.tool_calls) {
      // Accumulate arguments string
      toolCalls[tc.index].function.arguments += tc.function.arguments
    }
  }
}

// Parse after streaming completes
for (const tc of toolCalls) {
  tc.args = JSON.parse(tc.function.arguments)
}
```

## Debug Logging

Debug logs are only enabled in development mode (`NODE_ENV !== 'production'`).

When streaming is enabled, debug logs are sent to frontend:

```
[DEBUG] Starting agent loop. Tools available: 2, toolChoice: auto
[DEBUG] Tools: Web_Search_Agent_Tool, ...
[DEBUG] Iteration 1/20
[DEBUG] LLM response received. Content length: 54, thinking length: 0, tool_calls: 1
[DEBUG] Executing tool: Web_Search_Agent_Tool with args: {...}
[DEBUG] Tool Web_Search_Agent_Tool result: ...
```

## Testing

### Via curl

```bash
curl -X POST http://localhost:5678/webhook/agent-chat-webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Say hello to all agents", "sessionId": "test-123"}'
```

### What to check

1. **Tools available** — Should list all connected tools
2. **Tool calls extracted** — Should match LLM response
3. **Tool execution** — Should show args and results
4. **Iteration count** — Should complete when no more tool calls

## Common Issues

### Empty tool arguments

**Symptom:** `args: {}` in debug logs

**Cause:** Arguments not parsed after streaming

**Fix:** Parse `function.arguments` into `args` after stream completes

### Infinite loop

**Symptom:** Iterations keep going until maxIterations

**Cause:** LLM keeps returning tool calls

**Fix:** Check system message, ensure LLM knows when to stop

### Tool not found

**Symptom:** "Tool X not found in available tools"

**Cause:** Tool name mismatch between LLM response and connected tools

**Fix:** Check tool names in `getConnectedTools.ts`

## Migration from n8n Chat Model

The refactoring removed dependency on n8n's Chat Model node:

| Before | After |
|--------|-------|
| `ai_languageModel` input | Direct OpenAI SDK |
| Chat Model node in workflow | No Chat Model needed |
| Opaque `chatModel.invoke()` | Full control over request |
| No access to raw response | Access to thinking, tool_calls |

### Why migrate?

1. **Full control** — See exactly what's sent/received
2. **Thinking support** — Handle Claude's extended thinking
3. **Better debugging** — Log every step of the process
4. **Custom modes** — Implement single-shot tool execution
