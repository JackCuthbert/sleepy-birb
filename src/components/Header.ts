import styled from 'styled-components'
import { theme, spacing } from '../utils'

export const HeaderContainer = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  margin: 0;

  display: grid;
  grid-template-columns: 32px auto;
  grid-column-gap: ${spacing.smol};
  height: 32px;
  align-content: center;
  margin-bottom: ${spacing.base};
  font-size: 24px;
  cursor: pointer;
`

export const HeaderH1 = styled.h1`
  /* Icon alignment offset */
  position: relative;
  top: 1px;
  line-height: 1;
  font-weight: 700;
  color: ${theme.foreground};
`
