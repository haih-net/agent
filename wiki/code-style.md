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
