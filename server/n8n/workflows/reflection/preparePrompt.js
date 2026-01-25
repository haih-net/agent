// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const reflexes = $input.first().json?.data.response || []
const chatInput = $('Merge Trigger').first().json.chatInput || ''

const reflexesList = reflexes
  .map(
    (r) =>
      `## Reflex ${r.id} [${r.type}]

### Stimulus
${r.stimulus}

### Response
${r.response}

### Statistics
- **Effectiveness**: ${r.effectiveness ?? 'N/A'}
- **Execution Rate**: ${r.executionRate ?? 'N/A'}
`,
  )
  .join('\n---\n\n')

const systemMessage = `$systemMessageTemplate`

return [
  {
    json: {
      systemMessage,
      reflexes,
      reflexesList,
      chatInput,
    },
  },
]

// ## Reflex 4 [conditional]\n\n### Stimulus\nНужно сохранить информацию о себе (характеристики, возможности, ограничения)\n\n### Response\nСоздать Identity или Knowledge MindLog с high quality (0.9+) и интегрировать как концепцию в KB\n\n### Statistics\n- **Effectiveness**: N/A\n- **Execution Rate**: N/A\n- **ID**: cmkt4vsi800058hdzqjgw26he