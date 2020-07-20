import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { theme, spacing } from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons'

const MediaLink = styled.button<{ isPreviewing?: boolean }>`
  display: inline-block;
  background: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  color: #aaa;

  &:hover {
    color: ${theme.secondary};
  }

  margin-top: ${spacing.smol};
  margin-bottom: ${props => (props.isPreviewing ? spacing.smol : '0')};
  cursor: pointer;
`

const Container = styled.div`
  border: 1px ${theme.background} solid;
  padding: ${spacing.smol};
  margin: ${spacing.base} 0;
`

const MediaWarning = styled.p`
  border-radius: 3px;
  color: #aaa;
`

export const ExpandMedia: FC = props => {
  const [isExpanded, setExpanded] = useState(false)

  return (
    <Container>
      <MediaWarning>
        This tweet contains some kind of media that might not be viewable as
        intended here (gifs and videos). To view source material open the tweet
        on Twitter.com.
      </MediaWarning>

      <MediaLink
        isPreviewing={isExpanded}
        onClick={e => {
          e.preventDefault()
          setExpanded(!isExpanded)
        }}
      >
        {' '}
        <FontAwesomeIcon icon={isExpanded ? faTimes : faImage} />{' '}
        {isExpanded ? 'Hide' : 'Preview'} media{' '}
      </MediaLink>

      {isExpanded ? props.children : null}
    </Container>
  )
}
