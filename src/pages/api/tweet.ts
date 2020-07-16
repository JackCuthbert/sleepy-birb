import axios from 'axios'
import cheerio from 'cheerio'
import { NextApiRequest, NextApiResponse } from 'next'

export interface TweetInfo {
  author: string
  authorImage: string
  isReply: boolean
  hasMedia: boolean
  opUrl?: string
  mediaUrl?: string
  meta: string
  content: string
}

async function tweet(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  if (req.query.t === undefined) {
    return res.status(400).send('No "t" parameter')
  }

  if (Array.isArray(req.query.t)) {
    return res.status(400).send('"t" must be a string')
  }

  const { data } = await axios.get(req.query.t)
  const $ = cheerio.load(data)

  const isReply = $('.timeline.inreplytos table').length !== 0
  const hasMedia = $('.tweet-detail .media img').length !== 0

  const previousReplyUrl = isReply
    ? $('.timeline.inreplytos table')
        .last()
        .attr('href')
    : null

  const tweetTextContainer = $('.tweet-detail .tweet-text').html()
  const tweetMetadataContainer = $('.tweet-detail .metadata').html()

  const tweet: TweetInfo = {
    author: $('.tweet-detail .user-info .fullname').text(),
    authorImage: $('.tweet-detail .avatar img').attr('src'),
    isReply,
    hasMedia,
    mediaUrl: hasMedia ? $('.tweet-detail .media img').attr('src') : null,
    opUrl: previousReplyUrl,
    content: $(tweetTextContainer)
      .text()
      .trim(),
    meta: $(tweetMetadataContainer)
      .text()
      .trim()
  }

  res.status(200).send(tweet)
}

export default tweet
