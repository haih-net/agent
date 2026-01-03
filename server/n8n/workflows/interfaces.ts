import type { IWorkflowBase } from 'n8n-workflow'

export type WorkflowBase = Omit<
  IWorkflowBase,
  'id' | 'isArchived' | 'createdAt' | 'updatedAt' | 'activeVersionId'
>
