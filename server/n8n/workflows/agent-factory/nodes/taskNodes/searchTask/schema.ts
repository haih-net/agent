import { MyTasksQueryVariables } from 'src/gql/generated/myTasks'
import { TaskStatusEnum } from 'src/gql/generated/types'
import * as yup from 'yup'

const taskStatusValues = Object.values(TaskStatusEnum)

export const searchTaskSchema: yup.ObjectSchema<MyTasksQueryVariables> = yup
  .object()
  .shape({
    where: yup.object().shape({
      status: yup
        .string()
        .oneOf(taskStatusValues)
        .label(`Task status (${taskStatusValues.join(', ')})`),
      parentId: yup.string().label('Parent task ID'),
      incompletedOnly: yup
        .boolean()
        .label('Only incompleted tasks (default: true)'),
    }),
    skip: yup.number().label('Number of records to skip'),
    take: yup.number().label('Number of records to return'),
  })
