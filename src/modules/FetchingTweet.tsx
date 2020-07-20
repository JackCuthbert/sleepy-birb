import React, { FC } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Box } from '../components'
import { spacing } from '../utils'

const Container = styled(Box)`
  text-align: center;
`

const Body = styled.p`
  margin-bottom: ${spacing.base};
`

export const FetchingTweet: FC = () => (
  <Container>
    <Body>Fetching Tweet...</Body>
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
  </Container>
)
