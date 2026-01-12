import { Scalars } from 'src/gql/generated'
import { TypedTypePolicies } from 'src/gql/generated/helpers/apollo-helpers'

const DateTime = (
  v: string | null | undefined,
): Scalars['DateTime'] | null | undefined => {
  // @ts-expect-error types
  return typeof v === 'string' ? new Date(v) : v
}

export const typePolicies: TypedTypePolicies = {
  User: {
    fields: {
      createdAt: DateTime,
    },
  },
}
