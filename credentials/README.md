# Credentials

## Structure

```
credentials/
├── system/           # n8n system credentials (OpenRouter, etc.)
├── agents/           # Agent credentials (Internal API auth)
├── bootstrap.env     # n8n owner setup
└── README.md
```

## system/

n8n credentials in JSON format. The `id` field is used to link credentials to workflow factories.

Create `system/openrouter.json` for the AI provider selected during setup. The current workflow definitions refer to the OpenRouter credential by ID `FsN0N48lU327xkz6` and name `OpenRouter`; the file must use those values. This n8n credential is separate from `OPENROUTER_API_KEY` or `LLM_LOCAL_API_URL` in `docker/.env`, which configure direct GraphQL LLM calls.

### OpenRouter (Cloud API)

```json
[
  {
    "id": "FsN0N48lU327xkz6",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "sk-or-v1-xxx" }
  }
]
```

### Local LM Studio / LocalAI

Use an address reachable from the app container. For a provider on the Docker host, determine the gateway of this project's Docker network; it may differ from `172.17.0.1`.

```json
[
  {
    "id": "FsN0N48lU327xkz6",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "local", "url": "http://<docker-host-gateway>:1234/v1" }
  }
]
```

### Local llama.cpp server

Included in docker-compose. See [wiki/llama-server/README.md](../wiki/llama-server/README.md) for setup (requires NVIDIA GPU with CUDA).

```json
[
  {
    "id": "FsN0N48lU327xkz6",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "llama", "url": "http://llama:8080/v1" }
  }
]
```

### Telegram

Default credential ID: `telegram-main-bot`

This ID is used by `TelegramHandlerWorkflow` to find the Telegram bot credentials.

```json
[
  {
    "id": "telegram-main-bot",
    "name": "MyBot",
    "type": "telegramApi",
    "data": {
      "accessToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    }
  }
]
```

### Credential ID and WorkflowFactory

Workflow factories (`WorkflowFactory` classes) can define a static `credentialId` property to specify which credential they need. During bootstrap, the system passes all loaded credentials to `createWorkflow()`, and the factory uses its `credentialId` to find the right one.

Example:
```typescript
class TelegramHandlerWorkflow extends WorkflowFactory {
  static credentialId = 'telegram-main-bot'
  
  createWorkflow(credentials: CredentialsMap): WorkflowBase {
    const creds = credentials[TelegramHandlerWorkflow.credentialId]
    // ...
  }
}
```

To use a different Telegram bot, create a new workflow class with a different `credentialId`.

## agents/

Agent credentials for Internal API authentication.

Create `agents/agent-chat.json` and `agents/agent-web-search.json` before the first bootstrap. Their `agentName` values must be exactly `Chat Agent` and `Web Search Agent`; other workflows reference these names. The file names are also used as bootstrap keys (`agents/agent-chat` and `agents/agent-web-search`). Missing files or different names prevent workflow import.

### Required Fields

- `agentName` — exact workflow name: `Chat Agent` or `Web Search Agent`
- `username`, `password` — for Internal API auth
- `email`, `fullname` — agent user profile

> **Password security:** Generate strong random passwords (e.g., `openssl rand -base64 24`). Never include username, agent name, or other predictable patterns in passwords.

### Optional Fields

- `model` — model name from the AI provider (uses system default if not specified)
- `systemMessage` — custom system message for the agent (overrides default)
- `smtp` — allows agent to send emails
- `imap` — allows agent to read emails

### AgentFactoryConfig Parameters

Agent credentials can include any parameter from `AgentFactoryConfig` — see `server/n8n/workflows/agent-factory/interfaces.ts` for the full list with descriptions.

### Example

```json
{
  "agentName": "Chat Agent",
  "username": "chat-agent",
  "password": "generate-a-unique-password",
  "email": "chat-agent@example.com",
  "fullname": "Chat Agent",
  "systemMessage": "Custom system message for this agent instance",
  "hasMemoryRecall": true,
  "hasWebSearchAgent": true,
  "smtp": {
    "credentialId": "internal-agent-name-smtp",
    "credentialName": "SMTP - agent-name",
    "user": "agent@mail.example.com",
    "password": "smtp-password",
    "host": "mailserver",
    "port": 587,
    "ssl": false,
    "disableStartTls": false
  },
  "imap": {
    "credentialId": "agent-name-imap",
    "credentialName": "IMAP - agent-name",
    "user": "agent@mail.example.com",
    "password": "imap-password",
    "host": "mailserver",
    "port": 993,
    "secure": true
  }
}
```

### Bootstrap Creates

- `httpHeaderAuth` credential with JWT token for Internal API
- `smtp` credential if `smtp` config is present (for Send Mail tool)
- `imap` credential if `imap` config is present (for Check Mail tool)

## bootstrap.env

Create this file before starting n8n. It establishes the n8n owner account used to import credentials and workflows. Without it, bootstrap is skipped.

```
N8N_BOOTSTRAP_OWNER_EMAIL=admin@example.com
N8N_BOOTSTRAP_OWNER_PASSWORD=generate-a-unique-password
N8N_BOOTSTRAP_OWNER_FIRSTNAME=Admin
N8N_BOOTSTRAP_OWNER_LASTNAME=User
```

## Security

- All credential files are gitignored
