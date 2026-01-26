# Reflex Processing Rules

## Reflection Results

${reflectionResult}

---

## IF REFLEXES FOUND (not NO_MATCH)

1. **Execute matching reflexes** according to their "response" instructions
2. **Unconditional reflexes** — MUST be executed, no exceptions
3. **Conditional reflexes** — use if effectiveness is high
4. **Record reaction** — save stimulus, result, and self-assessment (scoreAgent: 0.0-1.0)

---

## IF NO_MATCH (no suitable reflexes)

1. **Create new reflex** before taking action:
   - Define "stimulus" — what triggers this situation
   - Define "response" — what actions to take
   - Set "type" to "conditional"

2. **Execute** the newly created reflex
3. **Record reaction** with self-assessment

---

## Core Rules

- **Every action** (tool call or final response) MUST be linked to a reflex
- **Every action** MUST produce a reaction record with scoreAgent
- **Multiple reflexes** may trigger — record each one
- **No recursion** — don't record reactions on reactions
