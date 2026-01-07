# Credentials

Credentials are organized into two folders for automatic import during bootstrap.

## Folder Structure

```
credentials/
├── system/           # n8n system credentials (external APIs)
│   ├── gitlab.json
│   ├── openrouter.json
│   └── telegram.json
├── agents/           # Agent credentials (FreeCode API auth)
│   ├── agent-chat.json
│   └── agent-gitlab.json
├── bootstrap.env     # n8n owner setup
└── README.md
```

## system/ — External Service Credentials

All `.json` files in `system/` are imported as n8n credentials.

### Format

```json
[
  {
    "id": "unique-credential-id",
    "name": "Display Name",
    "type": "credentialType",
    "data": {
      "apiKey": "your-api-key"
    }
  }
]
```

### Examples

**gitlab.json** (GitLab API):
```json
[
  {
    "id": "gitlab-api-cred",
    "name": "GitLab API",
    "type": "gitlabApi",
    "data": {
      "server": "https://gitlab.example.com",
      "accessToken": "glpat-xxxxxxxxxxxx"
    },
    "config": {
      "owner": "123",
      "testRepo": "group/project",
      "testBoardGroup": "group-name",
      "testBoardId": "gid://gitlab/Board/1",
      "testIssueIid": "1",
      "testListId": "gid://gitlab/List/1"
    }
  }
]
```

> **Note:** `config` section is required for GitLab workflows.
> - `data.server` is used both for n8n credential AND for HTTP Request URL (HTTP Request node does not extract server from credentials)
> - `config.owner` — User ID (numeric), can be found in GitLab profile settings
> - `config.testRepo` — test project path (e.g., "group/project") for Manual Trigger
> - `config.testBoardGroup` — group path for board testing
> - `config.testBoardId` — board ID in format `gid://gitlab/Board/{id}`
> - `config.testIssueIid` — issue IID for testing issue detail
> - `config.testListId` — list ID in format `gid://gitlab/List/{id}` for testing board list issues

**openrouter.json** (OpenRouter LLM):
```json
[
  {
    "id": "openrouter-cred",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": {
      "apiKey": "sk-or-v1-your-api-key"
    }
  }
]
```

**telegram.json** (Telegram Bot):
```json
[
  {
    "id": "telegram-cred",
    "name": "Telegram Bot",
    "type": "telegramApi",
    "data": {
      "accessToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    }
  }
]
```

## agents/ — Agent Credentials

All `.json` files in `agents/` are used to authenticate agents with FreeCode API.

### Format

```json
{
  "username": "agent-name",
  "password": "secure-password",
  "email": "agent@example.com",
  "fullname": "Agent Display Name"
}
```

Bootstrap will:
1. Sign in or register the agent in FreeCode
2. Create n8n `httpHeaderAuth` credential with the JWT token

## bootstrap.env

n8n owner setup credentials:

```
N8N_BOOTSTRAP_OWNER_EMAIL=admin@example.com
N8N_BOOTSTRAP_OWNER_PASSWORD=AdminPassword123!
N8N_BOOTSTRAP_OWNER_FIRSTNAME=Admin
N8N_BOOTSTRAP_OWNER_LASTNAME=User
```

## Security

- Always specify `id` to enable updates on re-import
- All credential files are gitignored by default
- Files are deleted after successful import (configurable)
