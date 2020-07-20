import React, { FC } from 'react'
import styled from 'styled-components'
import { Box, img, ExpandMedia } from '../components'
import { spacing } from '../utils'
import { TweetResponse } from '../pages/api/tweet'
import { Twemoji } from 'react-emoji-render'

const Container = styled(Box)`
  display: grid;
  grid-template-columns: 64px auto;
  grid-column-gap: ${spacing.base};
`

const Avatar = styled.img`
  ${img}
  border-radius: 50%;
`

const AvatarContainer = styled.div``

const Author = styled.div`
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20px;
`

const AuthorName = styled.h2`
  min-width: 100%;
  font-weight: 700;
  line-height: 1.2;
`

const AuthorHandle = styled.h3`
  min-width: 100%;
  font-size: 14px;
`

const TweetMedia = styled.img`
  ${img}
  border-radius: 3px;
`

interface Props {
  author: TweetResponse['author']
  tweet: TweetResponse['tweet']
  media: TweetResponse['media']
}

export const Tweet: FC<Props> = props => (
  <Container>
    <AvatarContainer>
      <Avatar src={props.author.image} />
    </AvatarContainer>
    <div>
      <Author>
        <AuthorName>{props.author.name}</AuthorName>
        <AuthorHandle>@{props.author.handle}</AuthorHandle>
      </Author>
      <p>
        {props.tweet.content.split('\n').map(text => {
          return (
            <>
              <Twemoji text={text} />
              <br />
            </>
          )
        })}
      </p>

      {props.media !== undefined ? (
        <ExpandMedia>
          <TweetMedia src={props.media.url} />
        </ExpandMedia>
      ) : null}
      <p>{props.tweet.meta}</p>
    </div>
  </Container>
)
