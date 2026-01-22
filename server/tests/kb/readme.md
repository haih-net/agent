# KB Tests — Knowledge Base Testing

## Goal

Testing the Knowledge Base system functionality through direct queries to Prisma Client. Verifying correctness of data storage, relationships, and queries.

## Approach

1. **Scenarios** — each test describes a comprehensive system use case
2. **Prisma Client** — work directly with the database, without GraphQL
3. **Manual analysis** — review query results and assess correctness

## Structure

```
kb/
├── readme.md                    ← this file
├── 001-company-knowledge/       ← scenario
│   ├── readme.md                ← case description
│   └── index.test.ts            ← tests
├── 002-.../
└── ...
```

## Workflow

1. Create `readme.md` with scenario description (what we load, what we test)
2. Agree on the scenario
3. Write tests

## Important

- Currently testing only database queries
- System can be used by multiple agents
- Verifying correctness of information assembly and querying
- Agents will be connected later

## Running

```bash
npm run test:api
```

Uses `.env.test` with test database `haih-net--agent--tests`.
