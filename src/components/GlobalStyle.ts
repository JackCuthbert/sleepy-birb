import { createGlobalStyle } from 'styled-components'
import { spacing, theme } from '../utils'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1C1C1C;
    line-height: 1.5;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
  }

  p + p, p + ul {
    margin-top: ${spacing.base};
  }

  ul {
    padding-left: ${spacing.base};
  }

  li {
    list-style-type: disc;
  }

  code {
    font-size: 14px;
    color: ${theme.secondary};
    background: ${theme.background};
    padding: 2px 3px;
    border-radius: 2px;
  }
`
