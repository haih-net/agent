# Loop Runner / Loop Handler

Pattern for creating infinite cyclic processes in n8n.

## Location

```
server/n8n/workflows/
├── loop-runner/    # Autostart + loop
└── loop-handler/   # Business logic
```

## Architecture

**Loop Runner** — manages the loop:
- Uses `n8nTrigger` with `activate` and `init` events
- Starts automatically when workflow is published or n8n starts
- Loop: `Execute Handler → Wait 5s → Execute Handler → ...`

**Loop Handler** — contains business logic:
- Called from Loop Runner via `executeWorkflow`
- Contains `Wait 10s` to simulate work
- Can be tested independently

## Diagram

```
[Loop Runner]
    │
    n8n Trigger (activate, init)
    │
    ├──► Execute Handler (Loop: Handler)
    │         │
    │         └── [business logic]
    │
    └──► Wait 5s ──► [back to Execute Handler]
```

## n8n Trigger Events

| Value | Description |
|----------|----------|
| `activate` | Workflow published (from unpublished state) |
| `update` | Updated already published workflow |
| `init` | n8n instance start/restart |

## Settings

Loop Runner has optimized settings for infinite loop:

```typescript
settings: {
  executionOrder: 'v1',
  saveDataSuccessExecution: 'none',  // Don't save successful executions
  saveExecutionProgress: false,       // Don't save progress
}
```

## Status

> **⚠️ Loop Runner is currently inactive** (`active: false`).
> 
> For activation, set `active: true` in `server/n8n/workflows/loop-runner/index.ts` and reimport workflows.

## Advantages

- Clear separation: loop separate, logic separate
- Handler can be tested independently
- Next iteration starts only after previous one completes
- Doesn't clutter database with executions

## Disadvantages

- On error in Handler the loop may break (error handling needed)
- When workflow is deactivated the loop will stop
