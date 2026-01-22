# Code Style

## Date Formatting

**Never use direct Date manipulation in frontend components.**

This breaks server-side rendering (SSR) because the server and client may have different timezones/locales, causing hydration mismatches.

### Bad

```tsx
{new Date(task.createdAt).toLocaleDateString()}
{new Date(task.createdAt).toLocaleString()}
```

### Good

Always use the `FormattedDate` component:

```tsx
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'

<FormattedDate value={task.createdAt} format="dateShort" />
<FormattedDate value={task.createdAt} format="dateTimeMedium" />
```

Available formats:
- `datePadded` — `2024-01-15`
- `dateShort` — `1/15/24`
- `dateMedium` — `Jan 15, 2024`
- `dateLong` — `January 15, 2024`
- `dateFull` — `Monday, January 15, 2024`
- `dateTimePadded` — `2024-01-15 14:30`
- `dateTimeShort` — `1/15/24, 2:30 PM`
- `dateTimeMedium` — `Jan 15, 2024, 2:30:00 PM`
- `timeShort` — `14:30`
- `timeWithSeconds` — `14:30:45`

## Type Assertions

**Never use `as` type assertions to bypass TypeScript checks.**

Type assertions hide potential bugs and break type safety.

### Bad

```tsx
const id = taskId as string
const variables = getTaskQueryVariables(taskId as string)
```

### Good

Fix the types properly or add runtime checks:

```tsx
if (taskId) {
  const variables = getTaskQueryVariables(taskId)
}

// Or use conditional expression
variables: taskId ? getTaskQueryVariables(taskId) : undefined
```

If a function requires a specific type, the caller must ensure the value matches that type before calling.

## Styled Components Naming

Styled components must follow naming convention: `{ComponentName}{ElementName}Styled`

- **Prefix**: Parent React component name
- **Suffix**: `Styled`

### Example

For component `MindLogsView`:

```tsx
// styles.ts
export const MindLogsViewStyled = styled.div``
export const MindLogsViewListStyled = styled.div``
export const MindLogsViewItemStyled = styled.div``
```

For standalone component `MindLogCard`:

```tsx
// styles.ts
export const MindLogCardStyled = styled.div``
export const MindLogCardTitleStyled = styled.strong``
```

## GraphQL Mutation Return Types

**GraphQL mutations must return the full entity object, not a generic response.**

Mutations (create, update, delete) should return the actual entity type so clients can use the returned data directly without making additional queries.

### Bad

```typescript
// Generic response that hides the actual data
export const TaskResponse = builder.simpleObject('TaskResponse', {
  fields: (t) => ({
    success: t.boolean({ nullable: false }),
    message: t.string({ nullable: false }),
  }),
})

builder.mutationField('createTask', (t) =>
  t.field({
    type: TaskResponse,
    resolve: async (_root, args, ctx) => {
      await ctx.prisma.task.create({ data: { ... } })
      return { success: true, message: 'Task created' }
    },
  }),
)
```

### Good

```typescript
// Return the actual entity
builder.mutationField('createTask', (t) =>
  t.prismaField({
    type: 'Task',
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.task.create({
        ...query,
        data: { ... },
      })
    },
  }),
)
```

For delete operations, return the deleted entity before deletion or return `nullable: true` and return `null` on error.

## GraphQL Enum Types

**Enum types must be defined in a separate `enums.ts` file within the entity folder.**

This prevents circular import issues when `inputs.ts` needs to reference enum types that are defined in `index.ts`.

### Bad

```
KBLabel/
├── index.ts      ← defines KBLabelRoleEnum AND imports inputs.ts
├── inputs.ts     ← imports KBLabelRoleEnum from index.ts (circular!)
└── resolvers/
```

### Good

```
KBLabel/
├── index.ts      ← imports enums.ts and inputs.ts
├── enums.ts      ← defines and exports KBLabelRoleEnum
├── inputs.ts     ← imports KBLabelRoleEnum from enums.ts
└── resolvers/
```

### Example `enums.ts`

```typescript
import { builder } from '../../builder'
import { KBLabelRole } from '@prisma/client'

export const KBLabelRoleEnum = builder.enumType('KBLabelRole', {
  values: Object.values(KBLabelRole),
})
```

Then in `inputs.ts`:

```typescript
import { KBLabelRoleEnum } from './enums'

// Use in input fields
role: t.field({ type: KBLabelRoleEnum })
```
