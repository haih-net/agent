/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { createMachine } from 'xstate'

export const agentMachine = createMachine({
  id: 'agent',
  initial: 'receivingMessages',
  states: {
    receivingMessages: {
      on: {
        MESSAGES_WITH_TOOL_RESULTS: 'validatingToolResults',
        MESSAGES_WITHOUT_TOOL_RESULTS: 'callingLLM',
      },
    },
    validatingToolResults: {
      on: {
        TOOL_RESULTS_VALID: 'callingLLM',
        TOOL_RESULTS_INVALID: 'error',
      },
    },
    callingLLM: {
      on: {
        LLM_RESPONSE_TEXT: 'completedWithText',
        LLM_RESPONSE_TOOL_CALLS: 'completedWithToolCalls',
        LLM_ERROR: 'error',
      },
    },
    completedWithText: {
      type: 'final',
    },
    completedWithToolCalls: {
      type: 'final',
    },
    error: {
      type: 'final',
    },
  },
})
