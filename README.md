# Site Boilerplate

Base template for narasim.dev website projects.

## Stack

- **Frontend**: Next.js 16 + React 18 + styled-components 6
- **Backend**: Express 4 + Apollo Server 5 + Pothos GraphQL
- **Database**: PostgreSQL + Prisma ORM 6
- **Auth**: JWT (jsonwebtoken)
- **GraphQL**: Apollo Client 4 + WebSocket subscriptions (graphql-ws) + graphql-shield permissions
- **Testing**: Vitest 4
- **Components**: Storybook 10
- **Linting**: ESLint 9 + TypeScript ESLint (typed linting with `@typescript-eslint/no-deprecated`)

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:db:push

# Generate Prisma client and GraphQL types
npm run generate

# Start development (runs both Next.js and GraphQL server)
npm run dev

# Or start components separately
npm run storybook    # Component development on :6006
```

## Architecture

The project runs a unified server that:
1. **GraphQL Server** on port 4000 (`/api`) — with WebSocket support for subscriptions
2. **Next.js** on port 3000 — proxies `/api` requests to GraphQL server

In production, both are served from a single process.

## Project Structure

```
├── src/                        # Frontend source
│   ├── components/             # React components
│   ├── pages/                  # Next.js pages router
│   ├── gql/                    # GraphQL queries and generated types
│   │   ├── src/                # .graphql query files (Internal API)
│   │   ├── src/FreeCode/       # .graphql query files (External API - freecode.academy)
│   │   ├── generated/          # Auto-generated types
│   │   └── cli/                # Type generation scripts
│   ├── theme/                  # Styled-components theme
│   ├── types/                  # TypeScript types
│   └── ui-kit/                 # UI components library
├── server/                     # Backend source
│   ├── graphqlServer/          # Apollo Server setup with WS & permissions
│   │   └── permissions/        # graphql-shield rules
│   ├── schema/                 # Internal API - Pothos GraphQL schema (local DB)
│   │   ├── builder.ts          # Schema builder config
│   │   └── types/              # GraphQL types (User, etc.)
│   ├── externalApiClient/      # External API - proxy to freecode.academy
│   │   ├── gql/src/            # GraphQL queries to external API
│   │   ├── types/              # Pothos types for external entities
│   │   │   ├── FreeCodeUser/   # User operations (signin, signup, me, users)
│   │   │   ├── FreeCodeProject/# Project CRUD
│   │   │   ├── FreeCodeTask/   # Task CRUD
│   │   │   ├── FreeCodeBlog/   # Blog operations
│   │   │   └── FreeCodeTopic/  # Topic CRUD
│   │   └── index.ts            # Apollo Client to freecode.academy
│   ├── n8n/                    # n8n integration
│   │   ├── bootstrap/          # n8n API client & workflow import
│   │   ├── config.ts           # n8n connection config
│   │   └── workflows/          # Workflow definitions
│   │       ├── agent-chat/     # Main chat agent
│   │       ├── agent-api/      # API agent
│   │       ├── agent-factory/  # Agent factory
│   │       ├── agent-project-manager/
│   │       ├── agent-pr-manager/
│   │       ├── mcp-server/     # MCP server workflow
│   │       └── tool-*/         # Tool workflows
│   ├── context/                # Request context (prisma, auth, externalToken)
│   ├── prisma.ts               # Prisma client instance
│   └── index.ts                # Server entry point
├── prisma/                     # Database schema (local)
├── public/                     # Static assets (tracked)
└── shared/                     # Uploads and user files (not tracked)
```

## API Architecture

### Internal API (`server/schema/`)
Local database operations via Prisma. Types defined with Pothos.
- User management (local accounts)
- Local data storage

### External API (`server/externalApiClient/`)
Proxy to freecode.academy GraphQL API. Forwards requests with authentication.
- **FreeCodeUser**: signin, signup, me, users, usersCount
- **FreeCodeProject**: project, projects, createProject, updateProject
- **FreeCodeTask**: task, tasks, createTask, updateTask
- **FreeCodeBlog**: blog, blogs
- **FreeCodeTopic**: topic, topics, createTopic, updateTopic

### n8n Integration (`server/n8n/`)
AI agents and workflows for automation.
- Workflows auto-imported on server start
- Agents: chat, api, project-manager, pr-manager, gitlab, techlead, senior-dev, middle-dev, junior-dev, qa-engineer
- Tools: graphql-request, get-user-data, gitlab-projects, gitlab-issues, read-file, list-files

#### n8n Expressions in Workflow Parameters

When passing dynamic values to n8n node parameters (e.g., `systemMessage`), use the `=` prefix to mark the string as an expression:

```typescript
// ❌ Wrong — n8n treats {{ }} as literal text
systemMessage: "Current date: {{ $json.currentDate }}"

// ✅ Correct — = prefix tells n8n to process expressions
systemMessage: `=${systemMessage}`  // where systemMessage contains {{ $json.xxx }}

// ✅ Also correct — inline expression
systemMessage: "=Current date: {{ $json.currentDate }}"
```

The `=` prefix is required for n8n to evaluate `{{ }}` placeholders. Without it, expressions are passed as plain text.

#### Data Flow in Workflow Chains

**IMPORTANT**: When building node parameters with expressions, always trace the full data flow through the workflow chain.

Common mistake: assuming `$json` contains the original request data. In reality, each node transforms `$json`:

```
chatTrigger ($json.body.enableStreaming)
    ↓
Get Agent Data (transforms $json)
    ↓
Prepare Context (transforms $json again)
    ↓
AI Agent ($json now has completely different structure!)
```

**Rules:**
1. **Trace the chain** — identify all nodes between trigger and target node
2. **Check transformations** — each Code node or Set node changes `$json` structure
3. **Propagate needed values** — if a parameter is needed downstream, explicitly pass it through intermediate nodes (e.g., in `prepareContext.js`)
4. **Use correct references** — after `Prepare Context`, use `$json.enableStreaming`, not `$json.body.enableStreaming`

Example fix in `prepareContext.js`:
```javascript
const enableStreaming = triggerData.body?.enableStreaming ?? triggerData.enableStreaming

return [{
  json: {
    // ... other fields
    enableStreaming,  // explicitly propagate to downstream nodes
  }
}]
```

#### Custom Nodes Debugging

Custom nodes are in `server/n8n/custom-nodes/`. After changes, rebuild with:
```bash
cd server/n8n/custom-nodes && npm run build
```

**Debugging methods:**

1. **throw Error** — throws exception with debug info, visible in n8n execution logs and webhook response:
```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const mode = this.getNodeParameter('mode', 0, 'full') as string
  throw new Error(`[DEBUG] mode=${mode}, keys=${Object.keys(this).join(', ')}`)
  // ...
}
```

2. **Stream debug messages** — send debug info to frontend via streaming (only works when streaming is enabled):
```typescript
if (isStreamingAvailable) {
  ctx.sendChunk('item', 0, `\n[DEBUG] Tools: ${tools.length}\n`)
}
```

3. **this.logger** — n8n's built-in logger (available in IExecuteFunctions context):
```typescript
this.logger.debug('Executing agent')
this.logger.info('Tool called', { toolName })
this.logger.error('Failed', { error })
```

**Note**: `console.log` inside n8n nodes is captured by n8n and may not appear in stdout. Use `throw Error` or `this.logger` for reliable debugging.

#### Known Issue: enableStreaming=false Returns Empty Response

**⚠️ WARNING**: When `enableStreaming=false`, the agent executes correctly but returns an **empty response**.

This is a known n8n issue with response waiting — affects both custom `AgentOrchestrator` and native `@n8n/n8n-nodes-langchain.agent` nodes. The agent processes the request, tools execute, but the final response is not captured.

**Current workaround**: Keep `enableStreaming=true` (default) for production use.

#### Agent Tool Schema Export

**Problem**: When agents call other agents via `toolWorkflow`, the LLM didn't see parameter schemas — only `{"type": "object"}` without `properties`. This caused LLMs to guess parameter names (e.g., `message` vs `request`).

**Root cause**: n8n's `toolWorkflow` uses LangChain's `DynamicStructuredTool` with Zod schemas, but our custom `AgentOrchestrator` wasn't converting Zod to JSON Schema.

**Solution** (`server/n8n/custom-nodes/src/nodes/AgentOrchestrator/helpers/getConnectedTools.ts`):
```typescript
import { zodToJsonSchema } from 'zod-to-json-schema'

const convertSchemaToJsonSchema = (schema) => {
  if (schema && '_def' in schema) {
    return zodToJsonSchema(schema)
  }
  return schema || { type: 'object', properties: {} }
}
```

**Standardization** (`server/n8n/workflows/helpers.ts`):
- Created `createAgentTool()` helper for consistent agent-to-agent tool definitions
- All agent tools now use `message` as the standardized parameter name
- Single point of change for all agent tool configurations

### Credentials (`credentials/`)
Credentials are organized into folders:
- `system/` — n8n system credentials (GitLab, OpenRouter, Telegram, etc.) — all `.json` files auto-imported
- `agents/` — Agent config files (triggers EVM wallet generation)
- `wallets/` — Auto-generated EVM wallets (gitignored)

#### Agent Blockchain Identity

Each agent has a unique EVM wallet (private key, public key, address) generated on first bootstrap.
Wallets are stored in `credentials/wallets/{agent-name}.json` and used for blockchain identity.

Bootstrap process:
1. Reads agent configs from `agents/*.json`
2. Generates EVM wallet if not exists (using ethers.js)
3. Stores wallet in `wallets/`
4. Creates n8n credential with agent's blockchain address

See `credentials/README.md` for details.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start full development server (Next.js + GraphQL) |
| `npm run storybook` | Start Storybook on :6006 |
| `npm run generate` | Generate Prisma client and GraphQL types |
| `npm run types` | TypeScript type check |
| `npm run lint` | ESLint check (with typed linting) |
| `npm run test:api` | Run API tests |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
GRAPHQL_WS_PORT=4000
PORT=3000
```

## GraphQL

- **Endpoint**: `http://localhost:4000/api` (direct) or `http://localhost:3000/api` (proxied)
- **Playground**: Apollo Sandbox available at GraphQL endpoint
- **WebSocket**: `ws://localhost:4000/api` for subscriptions
- **Permissions**: Configured via graphql-shield in `server/graphqlServer/permissions/`
