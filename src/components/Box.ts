import styled, { css } from 'styled-components'
import { theme, spacing } from '../utils'

export const box = css`
  padding: ${spacing.base};
  margin-bottom: ${spacing.base};
  border-radius: 3px;
  background-color: ${theme.backgroundAlt};
  color: ${theme.foreground};
`

export const Box = styled.div`
  ${box}
`

export const img = css`
  width: 100%;
  height: auto;
`

export const Img = styled.img`
  ${img}
`
