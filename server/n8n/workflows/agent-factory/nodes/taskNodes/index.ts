import { print } from 'graphql'
import { CreateTaskDocument } from 'src/gql/generated/createTask'
import { DeleteTaskDocument } from 'src/gql/generated/deleteTask'
import { MyTasksDocument } from 'src/gql/generated/myTasks'
import { UpdateTaskDocument } from 'src/gql/generated/updateTask'
import { TaskStatusEnum } from 'src/gql/generated/types'
import { NodeType } from '../../interfaces'

const createTaskQuery = print(CreateTaskDocument)
const deleteTaskQuery = print(DeleteTaskDocument)
const searchTasksQuery = print(MyTasksDocument)
const updateTaskQuery = print(UpdateTaskDocument)

const taskStatusValues = Object.values(TaskStatusEnum).join(', ')

type getTaskNodesProps = {
  agentId: string
  agentName: string
}

export function getTaskNodes({ agentId, agentName }: getTaskNodesProps) {
  const taskNodes: NodeType[] = [
    {
      parameters: {
        name: 'create_task',
        description: `Create an agent's own Task. These are YOUR tasks as an agent, not user tasks. Available regardless of user auth status. You can only create tasks for yourself. Statuses: ${taskStatusValues}. Provide title (required), description, content, startDatePlaning, endDatePlaning, parentId (for subtasks).`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: createTaskQuery,
            variables: `={{ JSON.stringify({ data: { title: $fromAI('title', 'Task title', 'string'), description: $fromAI('description', 'Task description (optional)', 'string') || undefined, content: $fromAI('content', 'Task content (optional)', 'string') || undefined, startDatePlaning: $fromAI('startDatePlaning', 'Planned start date ISO (optional)', 'string') || undefined, endDatePlaning: $fromAI('endDatePlaning', 'Planned end date ISO (optional)', 'string') || undefined, parentId: $fromAI('parentId', 'Parent task ID for subtasks (optional)', 'string') || undefined } }) }}`,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
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
      id: `${agentId}-tool-create-task`,
      name: 'Create Task Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1600, 528],
    },
    {
      parameters: {
        name: 'search_tasks',
        description: `Search agent's own Tasks. These are YOUR tasks as an agent, not user tasks. Available regardless of user auth status. You can only see your own tasks. By default returns only incompleted tasks (incompletedOnly=true). Set incompletedOnly=false to include Done tasks. Filter by status and/or parentId. Statuses: ${taskStatusValues}.`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: searchTasksQuery,
            variables: `={{ (() => { const where = {}; const status = $fromAI('status', 'Filter by status (optional): ${taskStatusValues}', 'string'); const parentId = $fromAI('parentId', 'Filter by parent task ID (optional)', 'string'); const incompletedOnly = $fromAI('incompletedOnly', 'Only incompleted tasks (default true)', 'boolean'); if (status) where.status = status; if (parentId) where.parentId = parentId; if (incompletedOnly === false) where.incompletedOnly = false; return JSON.stringify({ where: Object.keys(where).length ? where : undefined, take: $fromAI('limit', 'Max results (default 50)', 'number') || 50 }); })() }}`,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
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
      id: `${agentId}-tool-search-tasks`,
      name: 'Search Tasks Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [2176, 528],
    },
    {
      parameters: {
        name: 'update_task',
        description: `Update an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks. Available regardless of user auth status. You can only update your own tasks. Can update: title, description, content, status (${taskStatusValues}), startDatePlaning, endDatePlaning, startDate, endDate.`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: updateTaskQuery,
            variables: `={{ JSON.stringify({ where: { id: $fromAI('id', 'Task ID to update', 'string') }, data: { title: $fromAI('title', 'New title (optional)', 'string') || undefined, description: $fromAI('description', 'New description (optional)', 'string') || undefined, content: $fromAI('content', 'New content (optional)', 'string') || undefined, status: $fromAI('status', 'New status (optional): ${taskStatusValues}', 'string') || undefined, startDatePlaning: $fromAI('startDatePlaning', 'Planned start date ISO (optional)', 'string') || undefined, endDatePlaning: $fromAI('endDatePlaning', 'Planned end date ISO (optional)', 'string') || undefined, startDate: $fromAI('startDate', 'Actual start date ISO (optional)', 'string') || undefined, endDate: $fromAI('endDate', 'Actual end date ISO (optional)', 'string') || undefined } }) }}`,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
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
      id: `${agentId}-tool-update-task`,
      name: 'Update Task Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1792, 528],
    },
    {
      parameters: {
        name: 'delete_task',
        description:
          "Delete an agent's own Task by ID. These are YOUR tasks as an agent, not user tasks. Available regardless of user auth status. You can only delete your own tasks.",
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: deleteTaskQuery,
            variables:
              "={{ JSON.stringify({ where: { id: $fromAI('id', 'Task ID to delete', 'string') } }) }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
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
      id: `${agentId}-tool-delete-task`,
      name: 'Delete Task Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1984, 528],
    },
  ]

  return taskNodes
}
