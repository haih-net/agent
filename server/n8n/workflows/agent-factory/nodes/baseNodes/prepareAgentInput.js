const items = $input.all()

const firstItem = items[0]?.json || {}
const secondItem = items[1]?.json || {}

const assistantMessages = firstItem.assistantMessages || []
const reflectionResult = secondItem.reflectionResult || {}
const instructions = secondItem.instructions || ''

const combinedAssistantMessages = [...assistantMessages]

if (reflectionResult || instructions) {
  let systemContent = 'MANDATORY: Follow the instructions below according to the reflection recommendations. Process the next user message in accordance with these instructions.\n\n'

  if (reflectionResult) {
    systemContent += `## Current Reflection Recommendations\n\n${reflectionResult}\n\n`
  }

  if (instructions) {
    systemContent += `## Important Instructions for Working with Reflections\n\n${instructions}`
  }

  combinedAssistantMessages.push({
    role: 'system',
    content: systemContent.trim(),
  })
}

return {
  ...firstItem,
  assistantMessages: combinedAssistantMessages,
}
