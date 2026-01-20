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

## Best Practices

### Code Node Input Access

In n8n Code nodes, use `$input.first()` to access input data:

```javascript
const item = $input.first().json

const url = item.url || ''
const method = item.method || 'GET'
```

**Do NOT use:**
- `$json` — only available in "Run Once for Each Item" mode
- `$input.all()[0]` — use `$input.first()` instead

## Agents

| Agent | Model | hasTools |
|-------|-------|----------|
| Chat Agent | claude-opus-4.5 | true |
| Web Search | perplexity/sonar-reasoning-pro | false |

## Tool Node Variables

При создании tool nodes для GraphQL запросов используем **yup схемы** для типизации и описания параметров.

### Структура

Каждая нода имеет отдельный `schema.ts` файл:

```typescript
// schema.ts
import { CreateTaskMutationVariables } from 'src/gql/generated/createTask'
import * as yup from 'yup'

export const createTaskSchema: yup.ObjectSchema<CreateTaskMutationVariables> =
  yup.object().shape({
    data: yup.object().shape({
      title: yup.string().required().label('Task title'),
      description: yup.string().label('Task description'),
      content: yup.string().label('Detailed task content'),
      startDatePlaning: yup.date().label('Planned start date (ISO format)'),
      endDatePlaning: yup.date().label('Planned end date (ISO format)'),
      parentId: yup.string().label('Parent task ID for subtasks'),
    }),
  })
```

```typescript
// index.ts
import { createTaskSchema } from './schema'

const schemaDescription = JSON.stringify(createTaskSchema.describe(), null, 2)

// В workflowInputs.value
{
  query: createTaskQuery,
  variables: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', \`${schemaDescription}\`, 'json') }}`,
}
```

### Правила

- Создавать `schema.ts` в папке каждой ноды
- Типизировать схему через `*QueryVariables` / `*MutationVariables` из `src/gql/generated/`
- Использовать `.label()` для описания полей — это попадает в `describe()` output
- Использовать `.required()` для обязательных полей
- Для enum полей использовать `.oneOf(values).label(\`Field name (${values.join(', ')})\`)`
- `description` ноды должен быть кратким — детали параметров в схеме

## Creating a New Agent

1. Create `server/n8n/workflows/agent-{name}/`
2. Create `index.ts` with `createAgent()` config
3. Create `system-message.md`
