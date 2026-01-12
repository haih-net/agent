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

n8n credentials in JSON format:

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

## agents/

Agent auth credentials:

```json
{
  "username": "agent-name",
  "password": "password",
  "email": "agent@example.com",
  "fullname": "Agent Name"
}
```

Bootstrap creates `httpHeaderAuth` credential with JWT token.

## bootstrap.env

```
N8N_BOOTSTRAP_OWNER_EMAIL=admin@example.com
N8N_BOOTSTRAP_OWNER_PASSWORD=AdminPassword123!
N8N_BOOTSTRAP_OWNER_FIRSTNAME=Admin
N8N_BOOTSTRAP_OWNER_LASTNAME=User
```

## Security

- All credential files are gitignored
