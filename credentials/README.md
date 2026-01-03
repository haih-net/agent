# Credentials

Place credential JSON files here for automatic import during bootstrap.

**Security**: Credential files are copied to a temporary location during bootstrap, imported via n8n API, and then **deleted**. They never persist inside the container.

## File Format

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

## Example: OpenRouter API

Create `openrouter.json`:

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

## Bootstrap Credentials

Create `bootstrap.env` for automatic admin user creation:


Format:
```
N8N_BOOTSTRAP_OWNER_EMAIL=admin@example.com
N8N_BOOTSTRAP_OWNER_PASSWORD=AdminPassword123!
N8N_BOOTSTRAP_OWNER_FIRSTNAME=Admin
N8N_BOOTSTRAP_OWNER_LASTNAME=User
```

**Security**: This file is read once during bootstrap, then **deleted**. Credentials never appear in container environment variables.

## Important

- Always specify `id` to enable updates on re-import
- Credential files are gitignored by default
- Files are deleted after successful import
