import { DefaultTheme, css } from 'styled-components'
import { theme } from '..'

export type BreakpointsKey = keyof (typeof theme)['breakpoints']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MinWidth = Record<BreakpointsKey, (args: any) => any>

// TODO: Work on types https://github.com/styled-components/styled-components/issues/430
// TODO: add support for functions inside templates to be able to write ${({theme}) => ...}
/**
 * @media(min-width)...
 */
export const minWidth = Object.keys(theme['breakpoints']).reduce(
  (accumulator, _label) => {
    const label = _label as BreakpointsKey
    accumulator[label] = (args: (theme: DefaultTheme) => string | string) => {
      let cssString = ''

      /**
       * If a function is passed, execute as function
       */
      if (typeof args === 'function') {
        cssString = args(theme)
      } else {
        cssString = args
      }

      return css`
        @media (min-width: ${theme['breakpoints'][label]}px) {
          ${cssString};
        }
      `
    }
    return accumulator
  },
  {} as MinWidth,
)
