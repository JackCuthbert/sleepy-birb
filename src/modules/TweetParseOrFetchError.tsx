import React, { FC } from 'react'
import { Box } from '../components'

export const TweetParseOrFetchError: FC = () => (
  <Box>
    <p>Failed to load the tweet, please double check the URL is correct.</p>
    <ul>
      <li>
        <code>https://twitter.com/:userId/status/:tweetId</code>
      </li>
      <li>
        <code>https://mobile.twitter.com/:userId/status/:tweetId</code>
      </li>
      <li>
        <code>https://twitter.com/:userId/status/:tweetId?s=123</code>
      </li>
      <li>or a variation of the above</li>
    </ul>
  </Box>
)
