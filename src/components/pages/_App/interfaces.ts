import React from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { ApolloClient } from '@apollo/client'
import { AppContext, AppInitialProps as NextAppInitialProps } from 'next/app'

export type LayoutStyledProps = React.PropsWithChildren<{
  variant?: 'default' | 'fullwidth' | 'office'
}>

/**
 * Расширенный контекст страниц приложения
 */
export interface NextPageContextCustom extends NextPageContext {
  /**
   * Аполло-клиент, чтобы в страницах и документе можно было
   * получить его в getInitialProps и вызвать запросы.
   * Надо именно так, чтобы иметь на выходе общий стейт клиента.
   */
  apolloClient: ApolloClientNormolized
}

export interface PageProps extends React.PropsWithChildren<
  Record<string, unknown>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialApolloState?: any

  /**
   * Apollo-client API query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryResult?: any

  /**
   * Серверная ошибка
   */
  statusCode?: number
}

/**
 * Свойства для основного приложения
 */
export type AppProps = {
  Component: Page
  pageProps: PageProps
}

/**
 * API-клиент
 */
export type ApolloClientNormolized = ApolloClient

/**
 * Страница с кастомным контекстом
 */
export type Page<P extends PageProps = PageProps, IP = P> = NextComponentType<
  NextPageContextCustom,
  IP,
  P
>

export interface AppInitialProps extends NextAppInitialProps {
  pageProps: PageProps
}

export type MainApp<P = AppProps> = React.FC<P> & {
  getInitialProps(context: AppContext): Promise<AppInitialProps>
}

export const withWs = true
