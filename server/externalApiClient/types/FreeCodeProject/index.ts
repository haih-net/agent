import { builder } from 'server/schema/builder'

export const ProjectStatus = builder.enumType('ProjectStatus', {
  values: [
    'New',
    'Accepted',
    'Rejected',
    'Processing',
    'Completed',
    'Reopened',
  ] as const,
})

export const FreeCodeProject = builder.simpleObject('FreeCodeProject', {
  fields: (t) => ({
    id: t.id(),
    name: t.string(),
    description: t.string({ nullable: true }),
    url: t.string({ nullable: true }),
    status: t.field({ type: ProjectStatus, nullable: true }),
    createdAt: t.field({ type: 'DateTime', nullable: true }),
    updatedAt: t.field({ type: 'DateTime', nullable: true }),
  }),
})

export const FreeCodeProjectResponse = builder.simpleObject(
  'FreeCodeProjectResponse',
  {
    fields: (t) => ({
      success: t.boolean(),
      message: t.string(),
      data: t.field({ type: FreeCodeProject, nullable: true }),
    }),
  },
)

import './resolvers/projects'
import './resolvers/project'
import './resolvers/createProject'
import './resolvers/updateProject'
