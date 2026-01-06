const config = $config

let triggerData = {}

if ($('Execute Workflow Trigger').isExecuted) {
  triggerData = $('Execute Workflow Trigger').first().json
} else if ($('When chat message received').isExecuted) {
  triggerData = $('When chat message received').first().json
}

const agentData = $('Get Agent Data').first().json.data?.freeCodeMe || null

const userId = triggerData.user?.id || null
const callerAgentId = triggerData.callerAgentId || null

let sessionId = ''
if (userId && callerAgentId) {
  sessionId = 'user_' + userId + '_agent_' + callerAgentId
} else if (userId) {
  sessionId = 'user_' + userId
} else if (callerAgentId) {
  sessionId = 'agent_' + callerAgentId
} else if (triggerData.sessionId) {
  sessionId = triggerData.sessionId
}

if (!sessionId) {
  throw new Error('Can not get sessionId')
}

return [
  {
    json: {
      chatInput: triggerData.chatInput || '',
      sessionId,
      user: triggerData.user || null,
      agent: agentData,
      agentId: config.agentId,
    },
  },
]
