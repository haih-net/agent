import { useEffect, useMemo, useState } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { ThemeProvider } from 'styled-components'
import { theme } from 'src/theme'

import { MainApp, AppProps, withWs } from './interfaces'

import { useApollo } from 'src/gql/apolloClient'

import { Page401 } from '../_Error/401'
import { Page404 } from '../_Error/404'
import { ErrorPage } from '../_Error'
import Head from 'next/head'

import { GlobalStyle } from 'src/theme/GlobalStyle'
import { useMeQuery } from 'src/gql/generated'
import { AppContextProvider } from 'src/components/AppContext'
import { SnackbarProvider, Snackbar } from 'src/ui-kit/Snackbar'
import { getInitialProps } from './getInitialProps'
import { useScrollPage } from 'src/hooks/useScrollPage'

export const App: MainApp<AppProps> = ({ Component, pageProps }) => {
  useScrollPage()

  const apolloClient = useApollo(pageProps.initialApolloState, withWs)

  const { data } = useMeQuery({
    client: apolloClient,
    ssr: false,
  })

  const user = data?.me

  const { statusCode } = pageProps

  const content = useMemo(() => {
    let content = null

    /**
     * Если получили серверную ошибку, выводим страницу ошибки
     */
    if (statusCode && statusCode !== 200) {
      switch (statusCode) {
        case 401:
        case 410:
          content = <Page401 />
          break
        case 404:
          content = <Page404 />
          break

        default:
          content = <ErrorPage statusCode={statusCode} />
      }
    } else {
      content = <Component {...pageProps} />
    }

    return <>{content}</>
  }, [statusCode, pageProps, Component])

  const template = (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ApolloProvider client={apolloClient}>
          <AppContextProvider user={user}>
            <SnackbarProvider>
              <>{content}</>
              <Snackbar />
            </SnackbarProvider>
          </AppContextProvider>
        </ApolloProvider>
      </ThemeProvider>
    </>
  )

  const [inited, initedSetter] = useState(
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_SSR !== 'false'
      : true,
  )

  useEffect(() => {
    initedSetter(true)
  }, [inited])

  return inited ? template : null
}

App.getInitialProps = getInitialProps
