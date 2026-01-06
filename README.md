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
- Agents: chat, api, project-manager, pr-manager
- Tools: graphql-request, get-user-data

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
