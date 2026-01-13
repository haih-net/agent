import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'
import { WorkflowBase } from '../interfaces'

const AGENT_NAME = 'GitLab Agent'

type NodeType = WorkflowBase['nodes'][number]

const agentId = 'gitlab-agent'

const gitlabToolNodes: NodeType[] = [
  {
    parameters: {
      name: 'gitlab_get_projects',
      description:
        'Get list of GitLab projects. Supports pagination with limit (default 10) and page (default 1).',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: 'Tool: GitLab Projects',
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          limit:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('limit', `Number of projects to return (default 10)`, 'number') }}",
          page: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('page', `Page number (default 1)`, 'number') }}",
        },
        matchingColumns: [],
        schema: [
          {
            id: 'limit',
            displayName: 'limit',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'number',
          },
          {
            id: 'page',
            displayName: 'page',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'number',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-gitlab-projects`,
    name: 'GitLab Get Projects Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [672, 720],
  },
  {
    parameters: {
      name: 'gitlab_get_issues',
      description:
        'Get issues from GitLab project. Project path is required (format: owner/repo or group/project). Can filter by state and assignee.',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: 'Tool: GitLab Issues',
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          project:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('project', `Project path in format owner/repo (required)`, 'string') }}",
          state:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('state', `Issue state: opened, closed, all (default: opened)`, 'string') }}",
          assignee:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('assignee', `Filter by assignee username (optional)`, 'string') }}",
          limit:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('limit', `Number of issues to return (default 10)`, 'number') }}",
        },
        matchingColumns: [],
        schema: [
          {
            id: 'project',
            displayName: 'project',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'state',
            displayName: 'state',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'assignee',
            displayName: 'assignee',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'limit',
            displayName: 'limit',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'number',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-gitlab-issues`,
    name: 'GitLab Get Issues Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1344, 512],
  },
  {
    parameters: {
      name: 'gitlab_get_board_lists',
      description:
        'Get board lists from GitLab board. Returns columns/lists of a board with their labels.',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: 'Tool: GitLab Board Lists',
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          fullPath:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('fullPath', `Group or project path (required)`, 'string') }}",
          boardId:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('boardId', `Board ID in format gid://gitlab/Board/{id} (required)`, 'string') }}",
          isGroup:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('isGroup', `True if fullPath is a group, false if project`, 'boolean') }}",
          assignee:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('assignee', `Filter by assignee username (optional)`, 'string') }}",
        },
        matchingColumns: [],
        schema: [
          {
            id: 'fullPath',
            displayName: 'fullPath',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'boardId',
            displayName: 'boardId',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'isGroup',
            displayName: 'isGroup',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'boolean',
          },
          {
            id: 'assignee',
            displayName: 'assignee',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-gitlab-board-lists`,
    name: 'GitLab Get Board Lists Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1568, 512],
  },
  {
    parameters: {
      name: 'gitlab_get_issue_detail',
      description:
        'Get detailed information about a specific issue/work item by its IID.',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: 'Tool: GitLab Issue Detail',
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          fullPath:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('fullPath', `Project path in format owner/repo (required)`, 'string') }}",
          iid: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('iid', `Issue IID number (required)`, 'string') }}",
        },
        matchingColumns: [],
        schema: [
          {
            id: 'fullPath',
            displayName: 'fullPath',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'iid',
            displayName: 'iid',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-gitlab-issue-detail`,
    name: 'GitLab Get Issue Detail Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [1792, 512],
  },
  {
    parameters: {
      name: 'gitlab_get_board_issues',
      description:
        'Get issues from a specific board column (list). Use after getting board lists to fetch issues in each column.',
      workflowId: {
        __rl: true,
        mode: 'list',
        value: 'Tool: GitLab Board Issues',
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          fullPath:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('fullPath', `Group or project path (required)`, 'string') }}",
          boardId:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('boardId', `Board ID in format gid://gitlab/Board/{id} (required)`, 'string') }}",
          listId:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('listId', `List ID in format gid://gitlab/List/{id} (required)`, 'string') }}",
          isGroup:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('isGroup', `True if fullPath is a group, false if project`, 'boolean') }}",
          assignee:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('assignee', `Filter by assignee username (optional)`, 'string') }}",
          first:
            "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('first', `Number of issues to return (default 10)`, 'number') }}",
        },
        matchingColumns: [],
        schema: [
          {
            id: 'fullPath',
            displayName: 'fullPath',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'boardId',
            displayName: 'boardId',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'listId',
            displayName: 'listId',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'isGroup',
            displayName: 'isGroup',
            required: true,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'boolean',
          },
          {
            id: 'assignee',
            displayName: 'assignee',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'string',
          },
          {
            id: 'first',
            displayName: 'first',
            required: false,
            defaultMatch: false,
            display: true,
            canBeUsedToMatch: true,
            type: 'number',
          },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: `${agentId}-tool-gitlab-board-issues`,
    name: 'GitLab Get Board Issues Tool',
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position: [2016, 512],
  },
]

const agentToolNodes: NodeType[] = [
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
  model: 'anthropic/claude-opus-4.5',
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
