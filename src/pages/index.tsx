import React, { useState, useCallback, useRef, useEffect } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import Head from 'next/head'
import { Twemoji } from 'react-emoji-render'
import { TweetInfo } from './api/tweet'

// interface TweetSource {
//   user: string
//   statusId: string
// }

async function fetchTweet(tweet: string) {
  const { data } = await axios.get('/api/tweet?t=' + encodeURIComponent(tweet))
  return data
}

// function parseTweet(url: string): TweetSource {
//   const reg = /\.com\/(.*?)\/.*\/(\d.*)\?/gi.exec(url)
//
//   return {
//     user: reg[1],
//     statusId: reg[2]
//   }
// }

function HomePage() {
  const urlInputRef = useRef(null)
  const [url, setUrl] = useState(
    'https://mobile.twitter.com/jack/status/1283571658339397632'
  )

  const { data, error } = useSWR<TweetInfo>([url], tweet => fetchTweet(tweet))

  const updateUrl = useCallback(() => {
    setUrl(urlInputRef.current.value)
  }, [setUrl])

  const loadReply = useCallback(
    (path: string) => {
      setUrl(`https://mobile.twitter.com${path}`)
    },
    [setUrl]
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div className="container mt-4">
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        />
      </Head>

      <div className="col-sm-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
        <h1 className="h3">
          Silent Twitter
        </h1>
        <hr />
        <div className="form-group">
          <label htmlFor="tweetUrl">Tweet URL</label>

          <div className="input-group">
            <input
              className="form-control"
              id="tweetUrl"
              defaultValue={url}
              ref={urlInputRef}
            />

            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => updateUrl()}
              >
                Load
              </button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Tweet</label>
          <div className="card">
            <div className="card-body">
              <div className="media">
                <img
                  className="mr-3 img-thumbnail rounded-circle"
                  src={data.authorImage}
                />
                <div className="media-body">
                  <h5 className="card-title mt-0">{data.author}</h5>
                  <p>
                    {data.content.split('\n').map(text => {
                      return (
                        <>
                          <Twemoji text={text} />
                          <br />
                        </>
                      )
                    })}
                  </p>
                  {data.hasMedia ? <img src={data.mediaUrl} /> : null}
                  <p className="mb-0">{data.meta}</p>
                </div>
              </div>
              <hr />
              <p className="mb-0">
                {data.isReply ? (
                  <>
                    {' '}
                    This tweet is a reply, view the previous one{' '}
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault()
                        loadReply(data.opUrl)
                      }}
                    >
                      on this page
                    </a>{' '}
                    or{' '}
                    <a
                      href={`https://twitter.com` + data.opUrl}
                      target="_blank"
                    >
                      on twitter.com
                    </a>{' '}
                    in a new tab.
                    <br />
                  </>
                ) : null}
                Open original tweet{' '}
                <a href={url} target="_blank">
                  on twitter.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
