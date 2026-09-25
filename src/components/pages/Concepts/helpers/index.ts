import { AppContextValue } from 'src/components/AppContext'
import {
  ConceptsConnectionQueryVariables,
  KbConceptVisibility,
  SortOrder,
} from 'src/gql/generated'

type getConceptsConnectionQueryVariablesProps =
  Partial<ConceptsConnectionQueryVariables> & {
    page: number
    take?: number
    currentUser: AppContextValue['user']
  }

export function getConceptsConnectionQueryVariables({
  page,
  take = 12,
  currentUser: _currentUser,
  where,
  ...other
}: getConceptsConnectionQueryVariablesProps): ConceptsConnectionQueryVariables & {
  take: number
} {
  const variable: ReturnType<typeof getConceptsConnectionQueryVariables> = {
    where: {
      visibility: KbConceptVisibility.PUBLIC,
      ...where,
    },
    skip: (page - 1) * take,
    take,
    orderBy: {
      updatedAt: SortOrder.DESC,
    },
    ...other,
  }

  return variable
}
