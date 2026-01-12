const config = $config

let triggerData = {}

// isExecuted is a valid boolean property in n8n runtime, n8n UI type error is incorrect
if ($('Execute Workflow Trigger').isExecuted) {
  triggerData = $('Execute Workflow Trigger').first().json
} else if ($('When chat message received').isExecuted) {
  triggerData = $('When chat message received').first().json
}

const agentData = $('Get Agent Data').first().json.data?.me || null

let userData = null
let authSessionId = null
try {
  if ($('Set Auth Context').isExecuted) {
    const authContext = $('Set Auth Context').first().json
    userData = authContext.user || null
    authSessionId = authContext.sessionId || null
  } else {
    userData = triggerData.user || null
  }
} catch {
  userData = triggerData.user || null
}

const userId = userData?.id || null
const callerAgentId = triggerData.callerAgentId || null

let sessionId = ''
if (userId && callerAgentId) {
  sessionId = 'user_' + userId + '_agent_' + callerAgentId
} else if (userId) {
  sessionId = 'user_' + userId
} else if (callerAgentId) {
  sessionId = 'agent_' + callerAgentId
} else if (authSessionId) {
  sessionId = authSessionId
} else if (triggerData.sessionId) {
  sessionId = triggerData.sessionId
}

if (!sessionId) {
  // TODO: Session loss occurs when messages pass from agent to agent to third agent.
  // Currently hardcoding fallback, but need to properly handle session propagation chain.
  console.error(new Error('Can not get sessionId'))
  sessionId = 'unhandledSessionId'
}

const enableStreaming =
  triggerData.body?.enableStreaming ?? triggerData.enableStreaming

return [
  {
    json: {
      chatInput: triggerData.chatInput || '',
      sessionId,
      user: userData,
      agent: agentData,
      agentId: config.agentId,
      currentDate: new Date().toISOString().split('T')[0],
      currentDateTime: new Date().toISOString(),
      enableStreaming,
    },
  },
]
