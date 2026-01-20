import { UpdateTaskMutationVariables } from 'src/gql/generated/updateTask'
import { TaskStatusEnum } from 'src/gql/generated/types'
import * as yup from 'yup'

const taskStatusValues = Object.values(TaskStatusEnum)

export const updateTaskSchema: yup.ObjectSchema<UpdateTaskMutationVariables> =
  yup.object().shape({
    where: yup.object().shape({
      id: yup.string().label('Task ID to update'),
    }),
    data: yup.object().shape({
      title: yup.string().label('Task title'),
      description: yup.string().label('Task description'),
      content: yup.string().label('Detailed task content'),
      status: yup
        .string()
        .oneOf(taskStatusValues)
        .label(`Task status (${taskStatusValues.join(', ')})`),
      startDatePlaning: yup.date().label('Planned start date (ISO format)'),
      endDatePlaning: yup.date().label('Planned end date (ISO format)'),
      startDate: yup.date().label('Actual start date (ISO format)'),
      endDate: yup.date().label('Actual end date (ISO format)'),
    }),
  })
