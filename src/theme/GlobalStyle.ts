import { createGlobalStyle } from 'styled-components'
import { theme } from './index'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    margin-top: 0;
    margin-bottom: 0;

    &:focus {
      outline: none;
    }
  }

  html, body{
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    font-family: 'Nunito', sans-serif;
    font-size: 16px;
  }

  #__next {
    height: 100%;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.foreground};
    
    &:hover {
      text-decoration: underline;
    }
    
    &:active {
      text-decoration: none;
    }
  }

  button {
    &:enabled {
      cursor: pointer;
    }
  }
`
