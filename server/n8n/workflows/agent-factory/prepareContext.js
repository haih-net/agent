const config = $config

let triggerData = {}

// isExecuted is a valid boolean property in n8n runtime, n8n UI type error is incorrect
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
  // TODO: Session loss occurs when messages pass from agent to agent to third agent.
  // Currently hardcoding fallback, but need to properly handle session propagation chain.
  console.error(new Error('Can not get sessionId'))
  sessionId = 'unhandledSessionId'
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
