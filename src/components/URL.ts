import styled from 'styled-components'
import { theme, spacing } from '../utils'
import { box } from './Box'

const INPUT_SIZE = '32px'

export const URLContainer = styled.div`
  display: grid;
  grid-template-columns: auto ${INPUT_SIZE};
  grid-column-gap: ${spacing.smol};
  margin-bottom: ${spacing.smol};
`

export const URLInput = styled.input.attrs({ type: 'text' })`
  ${box}
  margin: 0;
  height: ${INPUT_SIZE};
  border: 0;
  padding: 0 ${spacing.smol};
`

export const URLButton = styled.button.attrs({ type: 'button' })`
  width: ${INPUT_SIZE};
  height: ${INPUT_SIZE};
  border: 0;
  border-radius: 3px;
  background-color: ${theme.primary};

  &:hover {
    cursor: pointer;
  }
`
