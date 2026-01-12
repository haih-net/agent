import { AppContext } from 'next/app'

export type createApolloClientProps = {
  withWs: boolean

  /**
   * Application context. May be necessary for
   * forming correct headers when making API requests
   * on the server side in SSR mode
   */
  appContext?: AppContext
}
