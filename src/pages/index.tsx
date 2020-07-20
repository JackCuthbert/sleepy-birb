import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { TweetResponse } from './api/tweet'
import {
  Box,
  PageContainer,
  GlobalStyle,
  HeaderContainer,
  HeaderH1,
  URLContainer,
  URLButton,
  URLInput
} from '../components'
import { parseTweet, TweetPayload } from '../utils/tweet'
import { GetServerSideProps } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrow, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../utils'
import { FetchingTweet } from '../modules/FetchingTweet'
import { TweetParseOrFetchError } from '../modules/TweetParseOrFetchError'
import { Tweet } from '../modules/Tweet'

const Footer = styled.div`
  color: #aaa;
  font-size: 12px;
  opacity: 0.5;
`

const FooterLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: ${theme.secondary};
  }

  & + & {
    margin-left: 20px;
  }
`

async function fetchTweet(payload: TweetPayload): Promise<TweetResponse> {
  const { data } = await axios.post<TweetResponse>('/api/tweet', payload)
  return data
}

function HomePage(props: { host: string }): JSX.Element {
  const router = useRouter()
  const urlInputRef = useRef(null)

  const [parseError, setParseError] = useState(false)
  const [tweet, setTweet] = useState<TweetPayload | null>(null)

  // Only fetch when the tweet can be parsed
  const { data, error } = useSWR(tweet !== null ? [tweet] : null, fetchTweet)

  // Keep the URL in sync with the app state
  useEffect(() => {
    if (Array.isArray(router.query.t)) {
      return setParseError(true)
    }

    // If there's no tweet in the url, unset everything
    if (router.query.t === undefined) {
      urlInputRef.current.value = ''
      setTweet(null)
      setParseError(false)
      return
    }

    try {
      const parsed = parseTweet(decodeURIComponent(router.query.t))
      setTweet(parsed)
      setParseError(false)
    } catch (error) {
      setParseError(true)
    }
  }, [setTweet, setParseError, urlInputRef, router.query.t])

  // Manually request a new tweet and update the URL
  const loadTweet = useCallback(
    async (url: string) => {
      if (url === '') {
        setTweet(null)
        setParseError(false)
        await router.push({
          pathname: router.route,
          query: {}
        })
        return
      }

      try {
        const parsed = parseTweet(url)
        setTweet(parsed)
        setParseError(false)
      } catch (error) {
        console.error('Unable to parse tweet, try again')
        setParseError(true)
        return
      }

      await router.push({
        pathname: router.route,
        query: {
          t: url
        }
      })
    },
    [setParseError, setTweet, router.route]
  )

  const goHome = useCallback(async () => {
    await loadTweet('')
  }, [])

  const isSuccessful = error === undefined && data !== undefined && !parseError
  const isError = error !== undefined || parseError
  const isNoTweet = tweet === null && !parseError
  const isFetching = error === undefined && data === undefined && tweet !== null
  const isChild = isSuccessful && data.parent !== undefined

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <HeaderContainer onClick={goHome}>
          <FontAwesomeIcon icon={faCrow} color="#4D64C8" />
          <HeaderH1>Sleepy Birb</HeaderH1>
        </HeaderContainer>

        {/* URL Input */}
        <URLContainer>
          <URLInput
            placeholder="Tweet URL..."
            defaultValue={router.query.t}
            ref={urlInputRef}
          />
          <URLButton
            onClick={async () => {
              await loadTweet(urlInputRef.current.value)
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} fontSize="12px" color="#EEE" />
          </URLButton>
        </URLContainer>

        {isNoTweet ? (
          <Box>
            <p>Enter a Twitter URL in the field above and click "Load".</p>
          </Box>
        ) : null}

        {/* Fetching */}
        {isFetching ? <FetchingTweet /> : null}

        {/* Something went wrong in either fetch or parse */}
        {isError ? <TweetParseOrFetchError /> : null}

        {/* Succesfully retrieved tweet */}
        {isSuccessful ? (
          <Tweet tweet={data.tweet} author={data.author} media={data.media} />
        ) : null}

        <Footer>
          {isSuccessful ? (
            <>
              <FooterLink
                href={`${data.tweet.url}?sleepy=false`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open on Twitter.com
              </FooterLink>
              {isChild ? (
                <FooterLink
                  href="#"
                  className="card-link"
                  onClick={async e => {
                    e.preventDefault()
                    await loadTweet(data.parent.url)
                  }}
                >
                  Load parent
                </FooterLink>
              ) : null}
            </>
          ) : null}
          <FooterLink
            href="https://github.com/JackCuthbert/sleepy-birb"
            target="_blank"
            rel="noreferrer noopener"
          >
            Source Code
          </FooterLink>
          <FooterLink
            href="https://github.com/JackCuthbert/sleepy-birb-redirect/releases"
            target="_blank"
            rel="noreferrer noopener"
          >
            Browser extension
          </FooterLink>
        </Footer>
      </PageContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      host: context.req.headers.host
    }
  }
}

export default HomePage
