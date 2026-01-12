import { initializeApollo } from 'src/gql/apolloClient'
import NextApp, { AppInitialProps } from 'next/app'

import { MainApp, NextPageContextCustom, PageProps, withWs } from './interfaces'

export const getInitialProps: MainApp['getInitialProps'] = async (
  appContext,
) => {
  /**
   * Для того, чтобы в итоге можно было собрать общий аполло-стейт
   * с приложения и далее выполняемый страниц и документа,
   * передаем аполло-клиент далее в контекст приложения.
   */
  const apolloClient = initializeApollo({
    withWs: withWs,
    appContext,
  })

  /**
   * Передаваемый далее в страницу контекст
   */
  const ctx: NextPageContextCustom = {
    ...appContext.ctx,
    apolloClient,
  }

  const newAppContext = {
    ...appContext,
    ctx,
  }

  /**
   * Здесь вызывается page.getInitialProps() и далее _document.getInitialProps()
   * Все собирается в конечный appProps
   */

  const { pageProps, ...otherProps } =
    await NextApp.getInitialProps(newAppContext)

  const { statusCode } = pageProps as PageProps

  /**
   * Если выполняется на серверной стороне
   */
  if (statusCode && newAppContext.ctx.res) {
    newAppContext.ctx.res.statusCode = statusCode
  }

  const newProps: AppInitialProps = {
    ...otherProps,
    pageProps: {
      ...pageProps,
      statusCode,
      initialApolloState: apolloClient.cache.extract(),
    },
  }

  return newProps
}
