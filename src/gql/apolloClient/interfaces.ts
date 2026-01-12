import { NormalizedCacheObject } from '@apollo/client'
import { createApolloClientProps } from './createApolloClient/interfaces'

export type initializeApolloProps = createApolloClientProps & {
  initialState?: NormalizedCacheObject
}
