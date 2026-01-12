import type { Decorator } from '@storybook/react'
import { Context, AppContextValue } from 'src/components/AppContext'
import { MeQuery } from 'src/gql/generated'

export interface AppContextParameters {
  appContext?: {
    user?: MeQuery['me']
  }
}

export const withAppContext: Decorator = (Story, context) => {
  const params = context.parameters as AppContextParameters
  const user = params?.appContext?.user ?? null

  const contextValue: AppContextValue = {
    user,
    onAuth: undefined,
    onSignOut: undefined,
    isLoginFormOpen: false,
    openLoginForm: () => undefined,
    closeLoginForm: () => undefined,
  }

  return (
    <Context.Provider value={contextValue}>
      <Story />
    </Context.Provider>
  )
}
