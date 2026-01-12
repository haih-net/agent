import React from 'react'
import { NextComponentType, NextPageContext } from 'next'
import { ApolloClient } from '@apollo/client'
import { AppContext, AppInitialProps as NextAppInitialProps } from 'next/app'

export type LayoutStyledProps = React.PropsWithChildren<{
  variant?: 'default' | 'fullwidth' | 'office'
}>

/**
 * Extended context for application pages
 */
export interface NextPageContextCustom extends NextPageContext {
  /**
   * Apollo client so that in pages and documents it's possible to
   * get it in getInitialProps and make requests.
   * It must be exactly this way to have a common client state as output.
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
   * Server error
   */
  statusCode?: number
}

/**
 * Properties for the main application
 */
export type AppProps = {
  Component: Page
  pageProps: PageProps
}

/**
 * API client
 */
export type ApolloClientNormolized = ApolloClient

/**
 * Page with custom context
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
