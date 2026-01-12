import {
  MindLogsWithCountQueryVariables,
  MindLogQueryVariables,
} from 'src/gql/generated'

export function getMindLogsWithCountQueryVariables(
  page: number,
  pageSize: number,
): MindLogsWithCountQueryVariables {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  }
}

export function getMindLogQueryVariables(
  mindLogId: string | undefined,
): MindLogQueryVariables {
  return {
    where: {
      id: mindLogId,
    },
  }
}
