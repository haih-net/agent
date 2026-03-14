# Registration Policy

## Overview

By default, user registration requires a **referral token** from an existing user. This helps reduce fake registrations and spam accounts.

## Referral System

### How It Works

1. An existing user generates a referral token via `createReferrerToken` mutation
2. The token is shared with a new user (e.g., via URL: `?referrerToken=xxx`)
3. New user registers using the token
4. The new user is linked to the referrer (`referrerId` field)

### Token Properties

- **Expiration**: Configurable via `REFERRER_TOKEN_TTL` (default: `1H`)
- **Type**: JWT signed with `JWT_SECRET`

### Bypass Cases

Registration **without** a referral token is allowed for:

- **MetaMask authentication** — wallet-based auth reduces spam
- **Telegram authentication** — account verification via Telegram

## User Statuses

| Status | Can Create Topics | Can Comment | Description |
|--------|-------------------|-------------|-------------|
| `active` | ✅ | ✅ | Full access |
| `newbie` | ❌ | ✅ | Limited access for new users |
| `blocked` | ❌ | ❌ | Account suspended |

### Default Status

New users receive the status defined by `USER_DEFAULT_STATUS`:

- If not set: `active` (full access)
- Recommended: `newbie` (limited access until manually promoted)

## Environment Variables

```env
# Registration strategy
# If set to ANY, registration is open without referral token
# NEXT_PUBLIC_SITE_SIGNUP_STRATEGY=ANY

# Default status for new users
# USER_DEFAULT_STATUS=newbie

# Referral token expiration (default: 1H)
# REFERRER_TOKEN_TTL=1H
```

## GraphQL API

### Generate Referral Token

```graphql
mutation {
  createReferrerToken
}
```

Returns a JWT token string. Requires authentication.

### Sign Up with Token

```graphql
mutation {
  signup(data: {
    username: "newuser"
    password: "password123"
    referrerToken: "eyJhbGciOiJIUzI1NiIs..."
  }) {
    success
    token
  }
}
```

## Permissions

The `isActive` rule in GraphQL Shield restricts certain mutations to users with `active` status:

- `createPost` — only active users can create topics
- `updatePost` — only active users can edit posts

Newbies can still create comments (posts with `parentId`), but this is handled at the resolver level.
