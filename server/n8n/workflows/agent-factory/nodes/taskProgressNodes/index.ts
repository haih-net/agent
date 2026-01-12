import { print } from 'graphql'
import { CreateTaskProgressDocument } from 'src/gql/generated/createTaskProgress'
import { DeleteTaskProgressDocument } from 'src/gql/generated/deleteTaskProgress'
import { TaskProgressListDocument } from 'src/gql/generated/taskProgressList'
import { NodeType } from '../../interfaces'

const createTaskProgressQuery = print(CreateTaskProgressDocument)
const deleteTaskProgressQuery = print(DeleteTaskProgressDocument)
const searchTaskProgressQuery = print(TaskProgressListDocument)

type getTaskProgressNodesProps = {
  agentId: string
  agentName: string
}

export function getTaskProgressNodes({
  agentId,
  agentName,
}: getTaskProgressNodesProps) {
  const taskProgressNodes: NodeType[] = [
    {
      parameters: {
        name: 'create_task_progress',
        description:
          "Add progress entry to an agent's own Task. These are YOUR task progress entries as an agent. Available regardless of user auth status. You can only add progress to your own tasks. Use to log work done, updates, or notes.",
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: createTaskProgressQuery,
            variables: `={{ JSON.stringify({ data: { taskId: $fromAI('taskId', 'Task ID to add progress to', 'string'), content: $fromAI('content', 'Progress content/description', 'string') } }) }}`,
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
      id: `${agentId}-tool-create-task-progress`,
      name: 'Create Task Progress Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [2368, 528],
    },
    {
      parameters: {
        name: 'search_task_progress',
        description:
          "Search agent's own task progress entries. These are YOUR progress entries as an agent. Available regardless of user auth status. You can only see progress for your own tasks. Filter by taskId to get all progress for a specific task.",
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: searchTaskProgressQuery,
            variables: `={{ (() => { const where = {}; const taskId = $fromAI('taskId', 'Filter by task ID (optional)', 'string'); if (taskId) where.taskId = taskId; return JSON.stringify({ where: Object.keys(where).length ? where : undefined, take: $fromAI('limit', 'Max results (default 50)', 'number') || 50 }); })() }}`,
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
      id: `${agentId}-tool-search-task-progress`,
      name: 'Search Task Progress Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [2560, 528],
    },
    {
      parameters: {
        name: 'delete_task_progress',
        description:
          "Delete an agent's own task progress entry by ID. Available regardless of user auth status. You can only delete your own progress entries.",
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query: deleteTaskProgressQuery,
            variables:
              "={{ JSON.stringify({ where: { id: $fromAI('id', 'Task Progress ID to delete', 'string') } }) }}",
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
      id: `${agentId}-tool-delete-task-progress`,
      name: 'Delete Task Progress Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [2752, 528],
    },
  ]

  return taskProgressNodes
}
