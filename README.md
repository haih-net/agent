# KMS-Agent

**Autonomous AI entity, not a chatbot.** Own identity, own credentials, own knowledge. The agent authenticates as itself, updates its own profile, tracks what it knows and how certain it is. Every action requires explicit reasoning — no black-box decisions.

Full-stack platform: Next.js 16, GraphQL, Prisma, PostgreSQL. Local-first — runs on your machine with optional local LLM.

→ [Full philosophy and principles](wiki/agent-philosophy.md)

---

## 🌐 Complete Web Platform

Next.js 16, Apollo GraphQL, Prisma ORM 6, PostgreSQL. Authentication via Telegram, MetaMask, or email. User roles, referral system, invite-only registration mode.

## 💳 Billing & Transactions

USDT top-up via Arbitrum with cryptographic verification. Internal transfers between users. Balance tracking, transaction history.

## 🧩 Code-First Agent Workflows

n8n is used as the workflow runtime, but you never edit workflows manually. Everything is generated from TypeScript code on startup:

- **Workflows** — defined in code, recreated on each run
- **Credentials** — loaded from `credentials/` directory, no UI setup needed
- **Custom nodes** — compiled from TypeScript, auto-registered
- **Version control** — all workflow logic lives in git, not in n8n database
- **Portability** — clone the repo, run it, workflows are ready

### Mandatory Reasoning

Every tool call requires a `reasoning` field — the agent must explain *why* it's taking this action before executing. This solves the "black box" problem:

- **Debugging** — see exactly why the agent chose web search over database lookup
- **Audit trail** — full history of decisions, not just actions
- **Learning** — analyze reasoning patterns to improve prompts and agent behavior
- **Trust** — users understand what the agent is doing and why

### Agent Identity & GraphQL Introspection

Agent has its own identity in the system — not a proxy for the user, but a first-class participant:

- **Own credentials** — agent authenticates as itself, with its own permissions
- **Schema discovery** — agent can query `__schema` to learn available queries/mutations
- **Self-learning** — explores the API, tries queries, remembers what works
- **Autonomous actions** — creates records, updates data, interacts with the system independently

## 🤖 Custom AgentOrchestrator

Direct OpenAI SDK integration. Streaming, tool loops, extended thinking (Claude). Full control over LLM requests — no black-box abstractions.

## 📚 Epistemic Knowledge Base

N-ary facts with confidence levels, temporal validity, contradiction handling. Knowledge Spaces (private/shared/public). Agent tracks what it knows and how certain it is.

## ✍️ Self-Hosted Publishing

Own your content. Built-in posts with revisions, comments, user profiles. No platform lock-in — your blog, your server, your data.

## 🏠 Local-First

Runs on your machine. Optional local LLM via llama.cpp (NVIDIA GPU). Your data stays local.

## 🖥️ Computer Vision

Local image recognition via Qwen3.5 vision model. Analyze images, charts, diagrams — all running locally on your GPU. No cloud APIs, no data leaving your machine.

- **OpenAI-compatible API** — same `/v1/chat/completions` endpoint
- **Auto-download** — models fetched from HuggingFace on first run
- **Base64 input** — send images directly in requests

## 🎨 AI Image Generation

Generate images directly in the FileUploader component using LLM-powered image generation. Describe what you need, and the system creates the image for you.

- **Integrated workflow** — generate, preview, and save images in one place
- **LLM-powered** — uses Gemini 3.1 Flash Image model via OpenRouter
- **Configurable** — set aspect ratio (16:9) and resolution (1K)
- **User-controlled** — generate, review, then save or cancel

**Configuration:**
- Set `NEXT_PUBLIC_ALLOW_GENERATE_IMAGES=true` in `docker/.env` to enable
- Requires OpenRouter API key configured
- Currently available only for active users

**⚠️ Feature availability:** Image generation and direct LLM resolver are currently enabled only for active users.

## 🔍 Full Transparency

All state is inspectable: GraphQL playground, Prisma Studio, n8n workflow editor. Nothing hidden.

---

## 🚧 Active Development

Project under active development. Feedback, ideas, PRs welcome.

For **researchers** exploring cognitive architectures. For **indie bloggers** who want their own platform. For **developers** building persistent AI systems.

---

## Quick Start

> Clone the repo and tell your AI assistant to set it up:
>
> *"Clone https://github.com/haih-net/agent, set it up, run it and open in my browser"*

Cursor, Windsurf, Claude Code — any AI coding assistant will handle Docker, database, migrations, and workflows. Working system at `http://localhost:3000` in minutes.

---

## Stack

```
Frontend:  Next.js 16 · React · styled-components
Backend:   Express 4 · Apollo Server 5 · Pothos GraphQL
Database:  PostgreSQL · Prisma ORM 6
Auth:      JWT · Telegram · MetaMask (Ethereum)
Billing:   USDT (Arbitrum) · internal transfers
AI:        n8n (code-first) · custom AgentOrchestrator
Infra:     Docker · Traefik · docker-mailserver · llama.cpp
```

## Documentation

[wiki](wiki/README.md) — architecture, configuration, API reference.

---

## AI Agent Setup Instructions

> **For AI coding assistants:** This section is for you. The project requires full autonomous setup — understand the architecture and proceed independently. Guide the user only on how to use the system.
>
> **⚠️ IMPORTANT:** Always read [`AGENT.md`](AGENT.md) first before any actions. It contains critical setup instructions and links to all necessary documentation.

### AI Model Configuration

First, ask the user which AI integration they prefer:

**Options:**
- **OpenRouter API key** (recommended for best results)
- **Local LM Studio** or similar local service
- **Local llama.cpp server** (included in docker-compose, requires NVIDIA GPU with CUDA)
- **Other custom AI endpoint**

**Recommended models (OpenRouter):**

Start with `google/gemini-3.1-flash-lite-preview` — good quality at minimal cost (fractions of a cent per full operation cycle). Only upgrade to `anthropic/claude-sonnet` or `anthropic/claude-opus` if the project is complex and requires higher reasoning capabilities.

- **Default:** `google/gemini-3.1-flash-lite-preview` or `anthropic/claude-haiku-4.5`
- **For complex tasks:** `anthropic/claude-sonnet` or `anthropic/claude-opus`

> **Note:** The `model` field in agent credentials is optional. If not specified, the system uses a default model. Only set it when you need a specific model.

**Local models:**
- Minimum: `qwen3 4B`
- **llama.cpp:** Default `Qwen3.5-0.8B` (testing), recommended `Qwen3.5-4B`+ for production
- **Vision:** `Qwen3.5-4B` with `mmproj-F16.gguf` for image recognition

**Required credentials from user:**
- For OpenRouter: API key
- For local LM Studio: endpoint URL and any authentication details
- For local llama.cpp: no credentials needed (runs locally), but requires NVIDIA GPU with CUDA drivers
- For custom endpoints: full connection details

**⚠️ Local llama.cpp requirements:**
- NVIDIA GPU with CUDA support
- CUDA drivers installed on host system (verify with `nvidia-smi`)
- Docker with NVIDIA Container Toolkit configured

### Quick Test

After startup, verify the system by sending a POST request:

```bash
curl -X POST http://localhost:3000/webhook/chat-agent-webhook \
  -H "Content-Type: application/json" \
  -d '{"chatInput": "Hello", "sessionId": "test-session"}'
```

Then open `http://localhost:3000` in the browser and guide the user through the chat interface.

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ and npm (only for Local Development)

---

## Docker Setup (recommended)

No local Node.js setup required — everything builds inside containers.

### Step 1 — Set up credentials

The `credentials/` directory is gitignored. Create files manually — see [`credentials/README.md`](credentials/README.md) for AI providers, agent credentials, SMTP/IMAP, and Telegram setup.

### Step 2 — Create environment file

```bash
cp docker/.env.sample docker/.env
```

Fill in `docker/.env`:

```env
SUPABASE_DB_PASSWORD=postgres
SUPABASE_DB_NAME=postgres
DATABASE_URL=postgresql://postgres:postgres@supabase:5432/postgres
JWT_SECRET=<openssl rand -hex 32>
N8N_ENCRYPTION_KEY=<openssl rand -hex 16>
N8N_SECURE_COOKIE=false
N8N_BOOTSTRAP_ACTIVATE_WORKFLOWS=true
N8N_PERSONALIZATION_ENABLED=false
NODES_EXCLUDE=[]
N8N_CUSTOM_EXTENSIONS=./.n8n/custom
GRAPHQL_ENDPOINT=http://localhost:4000/api
```

> `DATABASE_URL` must use `@supabase:5432` (Docker service name), not `@localhost:5432`. `localhost` only works when running outside Docker.

### Step 3 — Start Supabase + App

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d supabase
# Wait until docker compose ps supabase reports healthy.
DOCKER_BUILDKIT=0 docker compose -f docker-compose.yml -f docker-compose.dev.yml build app
# Generate into the bind-mounted local src directory before starting the dev app.
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm --no-deps app npm run generate
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm --no-deps app npm run build:custom-nodes
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d app
```

**Important for first run:**

By default, registration requires a referral token, which prevents automatic registration of system agents. Set these variables in `docker/.env` before building:

- `NEXT_PUBLIC_SITE_SIGNUP_STRATEGY=ANY` — allows registration without referral token
- `USER_DEFAULT_STATUS=active` — gives new users full access immediately

**Optional:** To automatically create an admin user with sudo privileges, add:

- `SUDO_PASSWORD="your_password"` — creates admin user with sudo rights

The database must be healthy before the app image build because its Dockerfile runs Prisma migrations and seed during the build. The custom nodes must be built before n8n starts so agent workflows can load them. The first build takes a few minutes.

**Development preparation:** The dev Compose file bind-mounts local `src`, `server`, and `prisma` over the image directories. Generated files inside the image are therefore hidden by the local directories. Prepare the local development checkout before starting the dev app: follow **Local Development** below to install dependencies (`npm ci`), configure the host database connection, start PostgreSQL, apply migrations (`npm run prisma:deploy`), generate code (`npm run generate`), and compile custom nodes (`npm run build:custom-nodes`).

Alternatively, use the `compose run` commands above to generate code and compile custom nodes into the mounted checkout using the image's installed dependencies. The image build has already applied migrations and seed. This avoids requiring a local Node.js installation.

If the dev app fails with `Cannot find module 'src/gql/generated'`, recover from the `docker` directory:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm --no-deps app npm run generate
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d app
```

`docker exec -it tmp-agent-app-1 npm run generate` is only usable while that container is running. Restarting a container that immediately exits on missing generated files does not reliably allow `exec`; use the one-off `compose run` command first.


### Step 4 — Start Traefik (dev mode)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up traefik -d
```

> Do not create the `agicms-default` Docker network manually — let Compose create it. A manually created network lacks Compose labels and will cause an error.

**Result:**

- `http://localhost:2015` — app (via Traefik reverse proxy)
- `http://localhost:2080` — Traefik dashboard

> In Docker mode, Traefik proxies the app. In Local Development, the app runs directly on port 3000.

---

## Local Development (npm)

Full hot-reload development mode. Requires Node.js 22+ and npm.

### Step 1 — Set up credentials

Same as Docker Setup — see [`credentials/README.md`](credentials/README.md).

### Step 2 — Install dependencies

```bash
npm ci
```

### Step 3 — Create environment files

```bash
cp docker/.env.sample docker/.env
cp .env.example .env
```

In both files, set `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres` (port mapped to host). The root `.env` is read by Prisma and the app server.

### Step 4 — Start Supabase

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up supabase -d
```

Check it's healthy (`STATUS: Up (healthy)`, port `5432` mapped):

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps supabase
```

### Step 5 — Run database migrations

```bash
npm run prisma:deploy
```

Expected output:

```
Applying migration `20260119193349_initial`
Applying migration `20260122164751_knowledge_base`
Applying migration `20260125054235_experience_system`
All migrations have been successfully applied.
```

### Step 6 — Generate types and build custom nodes

```bash
npm run generate
npm run build:custom-nodes
```

- `generate` — generates Prisma Client and GraphQL TypeScript types into `src/gql/generated/`
- `build:custom-nodes` — compiles the `CUSTOM.agentOrchestrator` node required by Chat Agent and Web Search Agent

### Step 7 — Start the app

```bash
npm run clean && npm run dev:n8n
```

> `clean` is required before `dev:n8n` — it ensures n8n workflows are fully recreated from scratch on every start. Skipping it may result in stale or duplicate workflows.

Expected result:

```
[bootstrap] Workflow 'Chat Agent' activated
[bootstrap] Workflow 'Web Search Agent' activated
...
[bootstrap] Completed
Ready on http://localhost:3000, API at /api
```

**Ports:**

- `http://localhost:3000` — frontend
- `http://localhost:4000/api` — GraphQL playground
- `http://localhost:5678` — n8n workflow editor

> The `version` attribute warnings from Docker Compose are harmless and can be ignored.
