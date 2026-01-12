import { useApolloClient } from '@apollo/client/react'
import React, { useCallback, useMemo, useRef } from 'react'

import { MeQuery } from 'src/gql/generated'

import { useRouter } from 'next/router'

export type AppContextValue = {
  user: MeQuery['me']

  onAuth: ((token: string) => Promise<void>) | undefined
  onSignOut: (() => Promise<void>) | undefined
}

export const Context = React.createContext<AppContextValue | null>(null)

type AppContextProviderProps = React.PropsWithChildren<{
  user: AppContextValue['user']
}>

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  children,
}) => {
  const router = useRouter()

  const routerRef = useRef(router)

  routerRef.current = router

  const apolloClient = useApolloClient()

  const apolloClientRef = useRef(apolloClient)

  apolloClientRef.current = apolloClient

  const onAuth = useCallback(
    async (token: string) => {
      localStorage?.setItem('token', token)
      await apolloClient.resetStore().catch(console.error)
    },
    [apolloClient],
  )

  const onSignOut = useCallback(async () => {
    localStorage?.removeItem('token')
    await apolloClient.resetStore().catch(console.error)
  }, [apolloClient])

  const context = useMemo<AppContextValue>(() => {
    return {
      user,
      onAuth,
      onSignOut,
    }
  }, [onAuth, onSignOut, user])

  return <Context.Provider value={context}>{children}</Context.Provider>
}

export const useAppContext = () => {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('Please, provide AppContextProvider')
  }

  return context
}
