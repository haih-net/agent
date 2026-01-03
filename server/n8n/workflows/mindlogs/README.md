# MindLog Workflows

n8n workflows for AI agent knowledge management with SQLite backend.

## Workflows

| Workflow | Description | Input |
|----------|-------------|-------|
| `init-db.json` | Initialize/migrate database | - |
| `create-mindlog.json` | Create new mindlog | `type`, `data`, `quality` (optional) |
| `search-mindlog.json` | Search mindlogs | `type` (optional), `days` (optional), `limit` (optional, default 50) |
| `update-mindlog.json` | Update existing mindlog | `id`, `data`, `quality` (optional) |
| `delete-mindlog.json` | Delete mindlog by ID | `id` |

## MindLog Types

| Type | Description |
|------|-------------|
| `Stimulus` | Initial trigger/input from user or environment |
| `Reaction` | Agent's initial thought/response |
| `Action` | What the agent decided to do |
| `Result` | Outcome of the action |
| `Conclusion` | Lesson learned from the interaction |
| `Knowledge` | Persistent facts/patterns (update existing, don't duplicate) |
| `Error` | Error logs |
| `Evaluation` | External feedback from user |
| `Correction` | Adjustments based on feedback |

## Agent Workflow

1. **Before responding**: Search for relevant Knowledge mindlogs
2. **Respond** to user using retrieved knowledge
3. **After responding**: Audit and update knowledge

## Multi-Agent Isolation

Set `KNOWLEDGE_DB_PATH` environment variable for different agents:

```
Agent 1: KNOWLEDGE_DB_PATH=/knowledge/agents/agent-001
Agent 2: KNOWLEDGE_DB_PATH=/knowledge/agents/agent-002
```

## Testing

```bash
docker exec narasim-n8n-dev-knowledge-1 sh /knowledge/tests/test-workflows.sh
```

## MindLog Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | UUID primary key |
| `created_at` | TEXT | ISO timestamp |
| `updated_at` | TEXT | ISO timestamp (refreshed on update) |
| `type` | TEXT | MindLog type (see above) |
| `data` | TEXT | Content (free text or JSON) |
| `quality` | REAL | Quality score 0-10 (optional) |
