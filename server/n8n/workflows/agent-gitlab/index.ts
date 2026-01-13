import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool, createTool, createToolInputs } from '../helpers'

const AGENT_NAME = 'GitLab Agent'
const agentId = 'gitlab-agent'

const gitlabToolNodes = [
  createTool({
    name: 'gitlab_get_projects',
    toolName: 'GitLab Get Projects Tool',
    description:
      'Get list of GitLab projects. Supports pagination with limit (default 10) and page (default 1).',
    workflowName: 'Tool: GitLab Projects',
    nodeId: `${agentId}-tool-gitlab-projects`,
    position: [672, 720],
    inputs: createToolInputs([
      {
        name: 'limit',
        description: 'Number of projects to return (default 10)',
        type: 'number',
      },
      { name: 'page', description: 'Page number (default 1)', type: 'number' },
    ]),
  }),
  createTool({
    name: 'gitlab_get_issues',
    toolName: 'GitLab Get Issues Tool',
    description:
      'Get issues from GitLab project. Project path is required (format: owner/repo or group/project). Can filter by state and assignee.',
    workflowName: 'Tool: GitLab Issues',
    nodeId: `${agentId}-tool-gitlab-issues`,
    position: [1344, 512],
    inputs: createToolInputs([
      {
        name: 'project',
        description: 'Project path in format owner/repo (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'state',
        description: 'Issue state: opened, closed, all (default: opened)',
        type: 'string',
      },
      {
        name: 'assignee',
        description: 'Filter by assignee username (optional)',
        type: 'string',
      },
      {
        name: 'limit',
        description: 'Number of issues to return (default 10)',
        type: 'number',
      },
    ]),
  }),
  createTool({
    name: 'gitlab_get_board_lists',
    toolName: 'GitLab Get Board Lists Tool',
    description:
      'Get board lists from GitLab board. Returns columns/lists of a board with their labels.',
    workflowName: 'Tool: GitLab Board Lists',
    nodeId: `${agentId}-tool-gitlab-board-lists`,
    position: [1568, 512],
    inputs: createToolInputs([
      {
        name: 'fullPath',
        description: 'Group or project path (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'boardId',
        description: 'Board ID in format gid://gitlab/Board/{id} (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'isGroup',
        description: 'True if fullPath is a group, false if project',
        type: 'boolean',
        required: true,
      },
      {
        name: 'assignee',
        description: 'Filter by assignee username (optional)',
        type: 'string',
      },
    ]),
  }),
  createTool({
    name: 'gitlab_get_issue_detail',
    toolName: 'GitLab Get Issue Detail Tool',
    description:
      'Get detailed information about a specific issue/work item by its IID.',
    workflowName: 'Tool: GitLab Issue Detail',
    nodeId: `${agentId}-tool-gitlab-issue-detail`,
    position: [1792, 512],
    inputs: createToolInputs([
      {
        name: 'fullPath',
        description: 'Project path in format owner/repo (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'iid',
        description: 'Issue IID number (required)',
        type: 'string',
        required: true,
      },
    ]),
  }),
  createTool({
    name: 'gitlab_get_board_issues',
    toolName: 'GitLab Get Board Issues Tool',
    description:
      'Get issues from a specific board column (list). Use after getting board lists to fetch issues in each column.',
    workflowName: 'Tool: GitLab Board Issues',
    nodeId: `${agentId}-tool-gitlab-board-issues`,
    position: [2016, 512],
    inputs: createToolInputs([
      {
        name: 'fullPath',
        description: 'Group or project path (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'boardId',
        description: 'Board ID in format gid://gitlab/Board/{id} (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'listId',
        description: 'List ID in format gid://gitlab/List/{id} (required)',
        type: 'string',
        required: true,
      },
      {
        name: 'isGroup',
        description: 'True if fullPath is a group, false if project',
        type: 'boolean',
        required: true,
      },
      {
        name: 'assignee',
        description: 'Filter by assignee username (optional)',
        type: 'string',
      },
      {
        name: 'first',
        description: 'Number of issues to return (default 10)',
        type: 'number',
      },
    ]),
  }),
]

const agentToolNodes = [
  createAgentTool({
    name: 'techlead_agent',
    toolName: 'Tech Lead Tool',
    description:
      'Delegate technical tasks or report project status to the Tech Lead. Use when: (1) you need to report current project state from GitLab, (2) you need technical decisions on issues, (3) you need to escalate technical problems.',
    workflowName: 'Agent: Tech Lead',
    nodeId: `${agentId}-tool-techlead-agent`,
    position: [2240, 512],
  }),
  createAgentTool({
    name: 'project_manager_agent',
    toolName: 'Project Manager Tool',
    description:
      'Report project status or escalate issues to the Project Manager. Use when: (1) you need to report overall project state, (2) you need project-level decisions, (3) you need to escalate non-technical issues.',
    workflowName: 'Agent: Project Manager',
    nodeId: `${agentId}-tool-project-manager-agent`,
    position: [2464, 512],
  }),
]

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Agent for working with GitLab: viewing projects and issues assigned to user.',
  agentId,
  workflowName: 'Agent: GitLab',
  versionId: 'agent-gitlab-v2',
  credentialId: 'freecode-agent-gitlab-cred',
  credentialName: 'FreeCode API - agent-gitlab',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-gitlab-chat',
  instanceId: 'freecode-agent-gitlab',
  model: process.env.AGENT_GITLAB_MODEL || 'anthropic/claude-opus-4.5',
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [...gitlabToolNodes, ...agentToolNodes],
  additionalConnections: {
    'GitLab Get Projects Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'GitLab Get Issues Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'GitLab Get Board Lists Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'GitLab Get Issue Detail Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'GitLab Get Board Issues Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Tech Lead Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Project Manager Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
