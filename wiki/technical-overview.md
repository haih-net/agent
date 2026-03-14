# Technical Overview

## Stack

- **Frontend**: Next.js 16 + React 18 + styled-components 6
- **Backend**: Express 4 + Apollo Server 5 + Pothos GraphQL
- **Database**: PostgreSQL + Prisma ORM 6
- **Auth**: JWT
- **AI Engine**: n8n (code-first workflows, custom AgentOrchestrator node)
- **Infrastructure**: Docker, Traefik, docker-mailserver

## Project Structure

```
├── src/                          # Frontend (Next.js + React)
│   ├── components/
│   │   ├── Chat/                 # AI Chat Widget (ready to use)
│   │   └── ...
│   ├── pages/                    # Next.js pages
│   └── gql/                      # GraphQL queries + codegen
├── server/                       # Backend (Express + GraphQL)
│   ├── schema/                   # Pothos GraphQL schema
│   ├── graphqlServer/            # Apollo Server setup
│   └── n8n/                      # AI agent engine (code-first)
│       ├── bootstrap/            # Auto-import workflows on startup
│       ├── custom-nodes/         # AgentOrchestrator node
│       └── workflows/            # TypeScript workflow definitions
│           ├── agent-chat/       # Chat agent (code-first)
│           ├── agent-factory/    # Agent generator
│           └── tool-*/           # GraphQL, email, web search tools
├── prisma/                       # Database schema + migrations
│   ├── schema.prisma             # Models: User, Task, KB*, EX*
│   └── migrations/               # Version-controlled DB changes
├── docker/                       # Infrastructure
│   ├── mailserver/               # SMTP/IMAP server
│   ├── supabase/                 # PostgreSQL + pgAdmin
│   └── traefik/                  # Reverse proxy (production)
├── credentials/                  # n8n credentials (gitignored)
└── wiki/                         # Documentation
```

## Core Features

### Enterprise Infrastructure

| Feature | Description |
| ------- | ----------- |
| **Next.js 16 + SSR** | Modern React framework with server-side rendering |
| **GraphQL API** | Type-safe API with Pothos + Apollo Server |
| **Prisma ORM** | Database migrations, type-safe queries, PostgreSQL |
| **JWT Auth** | Production-ready authentication system |
| **Testing** | Vitest for unit + API tests, Storybook for components |
| **Docker** | Multi-stage builds, dev + prod configurations |
| **Mail Server** | Full SMTP/IMAP with docker-mailserver |

### Knowledge Base (KB)

Epistemic knowledge graph with temporal validity, confidence levels, and contradiction management:

- **N-ary Facts** — multiple concepts participate in facts through roles
- **Temporal Validity** — facts have time ranges when they're true
- **Confidence Tracking** — every fact has trust level (0.0-1.0)
- **Conflict Management** — contradictions are first-class objects, not errors
- **Knowledge Spaces** — contextual interpretation (private/shared/public)
- **Identity Operations** — merge/split concepts when discovering duplicates
- **Proposals & Decisions** — hypothesis testing and decision history

### AI Agent with Evolving Memory

Code-first n8n automation with custom AgentOrchestrator node:

- **TypeScript Workflows** — generate n8n workflows from code
- **Streaming Responses** — real-time AI responses with debug logs
- **Tool Execution** — GraphQL, web search, file ops, email
- **Memory System** — 12-type MindLogs for learning and context
- **Tool Calls History** — in-memory tracking with semantic search via Memory Recall agent
- **Email Integration** — agents can send/receive mail
- **Chat Widget** — ready-to-use React component with SSR

### Experience System (EX)

Reflex + Reaction system modeled after biological reflexes:

- **EXReflex** — behavioral rules (conditional/unconditional) with effectiveness tracking
- **EXReaction** — specific responses with triple scoring (agent / target user / mentor)

## n8n Integration

### Code-First Workflows

Workflows are defined in TypeScript, not JSON:

```typescript
class ChatAgentWorkflow extends AgentWorkflowFactory {
  getConfig(agentCreds: AgentCredentials): AgentFactoryConfig {
    return {
      agentName: 'Chat Agent',
      model: 'anthropic/claude-sonnet-4',
      hasWebSearchAgent: true,
      canSendMail: true,
    }
  }
}
```

### Custom AgentOrchestrator Node

Direct OpenAI SDK integration (not n8n's Chat Model):

- Full control over LLM requests/responses
- Streaming support with debug logs
- Tool execution loop with iteration limits
- Extended thinking support (Claude)

See [custom-nodes/agent-orchestrator.md](./custom-nodes/agent-orchestrator.md)

### Email Integration

Agents can send/receive emails via docker-mailserver. Mailboxes are created automatically.

See [workflows/README.md](./workflows/README.md#email-integration)

## Configuration

### Environment Variables

Copy `docker/.env.sample` to `docker/.env` and configure:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
GRAPHQL_WS_PORT=4000
PORT=3000

# AI Agent
AGENT_CHAT_MODEL="anthropic/claude-sonnet-4"
N8N_ENABLED=true

# Registration Policy (see registration-policy.md)
# NEXT_PUBLIC_SITE_SIGNUP_STRATEGY=ANY  # Open registration without referral
# USER_DEFAULT_STATUS=newbie             # Default status for new users
# REFERRER_TOKEN_TTL=1H                  # Referral token expiration
```

### AI Credentials

Create `credentials/system/openrouter.json`:

```json
[
  {
    "id": "openrouter-cred",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "sk-or-v1-xxx" }
  }
]
```

See [credentials/README.md](../credentials/README.md) for details.

## Manual Setup

1. Copy environment file:
```bash
cp docker/.env.sample docker/.env
```

2. Start database:
```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build supabase
```

3. Start application:
```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build app
```

4. Access:
   - **Frontend**: http://localhost:3000
   - **GraphQL Playground**: http://localhost:4000/graphql
   - **n8n UI**: http://localhost:5678
   - **Prisma Studio**: `npm run prisma:studio`
