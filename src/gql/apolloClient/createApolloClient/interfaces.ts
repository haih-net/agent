import { AppContext } from 'next/app'

export type createApolloClientProps = {
  withWs: boolean

  /**
   * Контекст приложения. Может быть необходим для
   * формирования правильных заголовков при API-запросах
   * на стороне сервера в режиме SSR
   */
  appContext?: AppContext
}
