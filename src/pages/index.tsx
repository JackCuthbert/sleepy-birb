import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { Twemoji } from 'react-emoji-render'
import { useRouter } from 'next/router'
import { TweetResponse } from './api/tweet'
import { Head, ExpandMedia } from '../components'
import { parseTweet, TweetPayload } from '../utils/tweet'
import { GetServerSideProps } from 'next'

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

  return (
    <>
      <Head />
      <div className="container-fluid mt-4">
        <div
          className="col-sm-12"
          style={{ maxWidth: '768px', margin: '0 auto' }}
        >
          <h1 className="h2">Sleepy Birb</h1>
          <hr />

          {/* Input for new tweet */}
          <div className="form-group">
            <label htmlFor="tweetUrl">Tweet URL</label>
            <div className="input-group">
              <input
                className={`form-control form-control-sm ${
                  parseError ? 'is-invalid' : ''
                }`}
                id="tweetUrl"
                defaultValue={router.query.t}
                ref={urlInputRef}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={async () => {
                    await loadTweet(urlInputRef.current.value)
                  }}
                >
                  Load
                </button>
              </div>
            </div>
          </div>
          {/* -- */}

          {/* Parse Error */}
          <div className="form-group">
            <label htmlFor="tweetUrl">Tweet</label>

            {tweet === null ? (
              <div className="card mb-5">
                <div className="card-body">
                  <p className="mb-0">
                    Enter a Twitter URL in the field above and click "Load".
                  </p>
                </div>
              </div>
            ) : null}

            {error !== undefined || parseError ? (
              <div className="card mb-5">
                <div className="card-body">
                  <p>
                    Failed to load the tweet, please double check the URL is
                    correct.
                  </p>
                  <ul>
                    <li>
                      <code>https://twitter.com/:userId/status/:tweetId</code>
                    </li>
                    <li>
                      <code>
                        https://mobile.twitter.com/:userId/status/:tweetId
                      </code>
                    </li>
                    <li>
                      <code>
                        https://twitter.com/:userId/status/:tweetId?s=123
                      </code>
                    </li>
                    <li>or a variation of the above</li>
                  </ul>
                </div>
              </div>
            ) : null}

            {/* Fetching */}
            {error === undefined && data === undefined && tweet !== null ? (
              <div className="d-flex align-items-center mt-2 mb-5">
                <strong>Fetching tweet...</strong>
                <div
                  className="spinner-border ml-auto"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            ) : null}

            {error === undefined && data !== undefined && !parseError ? (
              <div className="card mb-3">
                <div className="card-body">
                  <div className="media">
                    <img
                      className="mr-3 img-thumbnail rounded-circle"
                      src={data.author.image}
                    />
                    <div className="media-body">
                      <h2 className="card-title h5 mt-0">
                        {data.author.name}{' '}
                        <small className="text-muted">
                          @{data.author.handle}
                        </small>
                      </h2>
                      <p>
                        {data.tweet.content.split('\n').map(text => {
                          return (
                            <>
                              <Twemoji text={text} />
                              <br />
                            </>
                          )
                        })}
                      </p>
                      <p>{data.tweet.meta}</p>

                      {data.media !== undefined ? (
                        <ExpandMedia>
                          <img
                            className="img-fluid rounded mt-3"
                            src={data.media.url}
                          />
                        </ExpandMedia>
                      ) : null}

                      <hr />
                      {data.parent !== undefined ? (
                        <a
                          href="#"
                          className="card-link"
                          onClick={async e => {
                            e.preventDefault()
                            await loadTweet(data.parent.url)
                          }}
                        >
                          Load parent
                        </a>
                      ) : null}
                      <a
                        href={data.tweet.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="card-link"
                      >
                        Open on Twitter.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {error === undefined && data !== undefined && !parseError ? (
            <div className="form-group">
              <label htmlFor="sharePath">
                Link to this page (click to select)
              </label>
              <input
                className="form-control form-control-sm"
                id="sharePath"
                value={`https://${props.host}${router.asPath}`}
                onChange={() => {}}
              />
            </div>
          ) : null}
        </div>
      </div>
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
