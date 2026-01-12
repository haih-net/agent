import type { Preview, Decorator } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { ApolloProvider } from '@apollo/client/react'
import { theme } from '../src/theme'
import { GlobalStyle } from '../src/theme/GlobalStyle'
import { withAppContext } from './decorators/withAppContext'
import { withMsw } from './addons/msw/msw-decorator'
import { useApollo } from 'src/gql/apolloClient'

const WithProviders: Decorator = (Story) => {
  const apolloClient = useApollo(undefined, false)

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Story />
      </ThemeProvider>
    </ApolloProvider>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withMsw, withAppContext, WithProviders],
}

export default preview
