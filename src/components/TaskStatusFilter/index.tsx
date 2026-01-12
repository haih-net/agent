import React, { useMemo } from 'react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { TaskStatusEnum } from 'src/gql/generated'
import { TaskStatusBadge } from '../TaskStatusBadge'
import {
  TaskStatusFilterStyled,
  TaskStatusFilterLabel,
  TaskStatusFilterButtons,
  TaskStatusFilterClearButton,
} from './styles'

const ALL_STATUSES: TaskStatusEnum[] = [
  TaskStatusEnum.NEW,
  TaskStatusEnum.PROGRESS,
  TaskStatusEnum.DONE,
  TaskStatusEnum.REJECTED,
]

const buildFilterUrl = (
  router: ReturnType<typeof useRouter>,
  status: TaskStatusEnum | null,
) => {
  const newQuery: Record<string, string | string[]> = {}

  Object.keys(router.query).forEach((key) => {
    if (key !== 'status' && key !== 'page') {
      const value = router.query[key]
      if (value) {
        newQuery[key] = value
      }
    }
  })

  if (status) {
    newQuery.status = status
  }

  return {
    pathname: router.pathname,
    query: newQuery,
  }
}

const getStatusUrl = (
  status: TaskStatusEnum,
  selectedStatus: TaskStatusEnum | null,
  router: NextRouter,
) => {
  if (selectedStatus === status) {
    return buildFilterUrl(router, null)
  }
  return buildFilterUrl(router, status)
}

export const TaskStatusFilter: React.FC = () => {
  const router = useRouter()

  const selectedStatus = useMemo(() => {
    const queryStatus = router.query.status
    if (queryStatus && typeof queryStatus === 'string') {
      return queryStatus as TaskStatusEnum
    }
    return null
  }, [router.query.status])

  const isIncompletedActive = selectedStatus === null

  const incompletedUrl = useMemo(() => buildFilterUrl(router, null), [router])

  return (
    <TaskStatusFilterStyled>
      <TaskStatusFilterLabel>Status:</TaskStatusFilterLabel>
      <TaskStatusFilterButtons>
        <Link href={incompletedUrl}>
          <TaskStatusFilterClearButton as="span" $active={isIncompletedActive}>
            Incompleted
          </TaskStatusFilterClearButton>
        </Link>
        {ALL_STATUSES.map((status) => (
          <Link
            key={status}
            href={getStatusUrl(status, selectedStatus, router)}
          >
            <TaskStatusBadge
              status={status}
              active={selectedStatus === status}
            />
          </Link>
        ))}
      </TaskStatusFilterButtons>
    </TaskStatusFilterStyled>
  )
}
