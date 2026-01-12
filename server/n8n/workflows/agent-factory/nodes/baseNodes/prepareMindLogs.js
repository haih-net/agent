const contextData = $('Prepare Context').first().json
const mindLogsData = $('Fetch MindLogs').first().json

const userId = contextData.user?.id || null

const allMindLogs = mindLogsData.data?.response || []

const identity = allMindLogs.filter((log) => log.type === 'Identity')
const context = allMindLogs.filter((log) => log.type === 'Context')
const knowledge = allMindLogs.filter((log) => log.type === 'Knowledge')
const relationship = allMindLogs.filter(
  (log) => log.type === 'Relationship' && log.relatedToUserId === userId,
)

const formatMindLogs = (logs, title) => {
  if (!logs.length) return ''
  const entries = logs.map((log) => `- ${log.data}`).join('\n')
  return `## ${title}\n${entries}`
}

const sections = [
  formatMindLogs(identity, 'My Identity'),
  formatMindLogs(context, 'Current Context'),
  formatMindLogs(knowledge, 'My Knowledge'),
  formatMindLogs(relationship, 'About This User'),
].filter(Boolean)

const assistantMessage =
  sections.length > 0 ? `# My Memory\n\n${sections.join('\n\n')}` : ''

return [
  {
    json: {
      ...contextData,
      assistantMessages: assistantMessage
        ? JSON.stringify([{ role: 'assistant', content: assistantMessage }])
        : '[]',
      mindLogs: {
        identity,
        context,
        knowledge,
        relationship,
        total: allMindLogs.length,
      },
    },
  },
]
