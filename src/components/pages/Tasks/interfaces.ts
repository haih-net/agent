import { PageProps } from '../_App/interfaces'
import { TaskStatusEnum } from 'src/gql/generated'

export type TasksPageProps = PageProps & {
  selectedStatus: TaskStatusEnum | null
  page: number
}
