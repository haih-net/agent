/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createMachine } from 'xstate'
import { agentMachine } from './agent.machine'

export const worldMachine = createMachine({
  id: 'world',
  initial: 'idle',
  states: {
    // State: System waiting, no active request
    idle: {
      on: {
        // Trigger: New message received from user
        USER_MESSAGE: 'checkingAuth',
      },
    },

    // State: Message received, determining user identity
    checkingAuth: {
      on: {
        // Trigger: No token/invalid token - anonymous session by sessionId, skip user data
        USER_ANONYMOUS: 'fetchingAgentData',
        // Trigger: Valid token - authenticated user, need to load user profile first
        USER_AUTHENTICATED: 'fetchingUserData',
      },
    },

    // State: Loading authenticated user profile
    fetchingUserData: {
      on: {
        // Trigger: User profile loaded successfully
        USER_DATA_FETCHED: 'fetchingAgentData',
        // Trigger: Failed to load user data - log async, continue without user data
        USER_DATA_ERROR: 'fetchingAgentData',
      },
    },

    // State: Loading agent profile (who is this agent)
    fetchingAgentData: {
      on: {
        // Trigger: Agent profile loaded successfully
        AGENT_DATA_FETCHED: 'fetchingMindLogs',
        // Trigger: Failed to load agent data - log async, continue without agent data
        AGENT_DATA_ERROR: 'fetchingMindLogs',
      },
    },

    // State: Loading agent's MindLogs (Identity, Context, Relationship, Knowledge)
    fetchingMindLogs: {
      on: {
        // Trigger: MindLogs loaded - Identity, Context, Relationship (by userId/sessionId), Knowledge
        MINDLOGS_FETCHED: 'preparingAssistantMessages',
        // Trigger: Failed to load MindLogs - log async, continue without mindlogs
        MINDLOGS_ERROR: 'preparingAssistantMessages',
      },
    },

    // State: Formatting MindLogs as assistant messages (agent's own memory)
    preparingAssistantMessages: {
      on: {
        // Trigger: Messages array ready with role:assistant for MindLogs
        MESSAGES_PREPARED: 'callingAgent',
      },
    },

    // State: Agent processing request (LLM call in progress)
    callingAgent: {
      invoke: {
        id: 'agent',
        src: agentMachine,
      },
      on: {
        // Trigger: Agent returned text response (final answer)
        AGENT_RESPONSE_TEXT: 'sendingResponse',
        // Trigger: Agent returned tool_calls array (needs tool execution)
        AGENT_RESPONSE_TOOL_CALLS: 'executingTools',
        // Trigger: Agent/LLM error
        AGENT_ERROR: 'error',
      },
    },

    // State: Executing requested tools outside agent
    executingTools: {
      on: {
        // Trigger: Tools executed, results ready - loop back to agent with updated history
        TOOLS_EXECUTED: 'callingAgent',
        // Trigger: Tool execution failed - pass error as tool result to agent, let it handle
        TOOLS_ERROR: 'callingAgent',
      },
    },

    // State: Sending final response to user
    sendingResponse: {
      on: {
        // Trigger: Response delivered to user
        RESPONSE_SENT: 'idle',
        // Trigger: Failed to send response - log async, return to idle
        SEND_ERROR: 'idle',
      },
    },

    // State: Critical error - only for unrecoverable failures (e.g. LLM completely unavailable)
    error: {
      on: {
        // Trigger: Error handled, reset to idle
        RESET: 'idle',
      },
    },
  },
})
