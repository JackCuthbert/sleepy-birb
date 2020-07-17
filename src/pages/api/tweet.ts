import axios from 'axios'
import cheerio from 'cheerio'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { TWITTER_SCRAPE_URL } from '../../config'

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

export interface TweetResponse {
  author: {
    handle: string
    name: string
    image: string
    url: string
  }
  tweet: {
    content: string
    meta: string
    url: string
  }
  media?: {
    url: string
  }
  parent?: {
    url: string
  }
}

function validateRequest(handler: NextApiHandler): NextApiHandler {
  return (req, res) => {
    if (req.method !== 'POST') {
      return res.status(404).end()
    }

    if (req.body.userId === undefined) {
      return res.status(400).send('No "userId" property')
    }

    if (req.body.statusId === undefined) {
      return res.status(400).send('No "statusId" property')
    }

    return handler(req, res)
  }
}

async function tweet(req: NextApiRequest, res: NextApiResponse): Promise<any> {
  const userId = req.body.userId as string
  const statusId = req.body.statusId as string

  const { data: pageHtml } = await axios.get<string>(
    `${TWITTER_SCRAPE_URL}/${userId}/status/${statusId}`
  )
  const $ = cheerio.load(pageHtml)

  const tweetTextContainer = $('.tweet-detail .tweet-text').html()
  const tweetMetadataContainer = $('.tweet-detail .metadata').html()

  // author
  const authorName = $('.tweet-detail .user-info .fullname').text()
  const authorImage = $('.tweet-detail .avatar img').attr('src')

  const response: TweetResponse = {
    author: {
      handle: userId,
      image: authorImage,
      name: authorName.replace(/\\n/gi, '').trim(),
      url: `https://twitter.com/${userId}`
    },
    tweet: {
      content: $(tweetTextContainer).text().trim(),
      meta: $(tweetMetadataContainer).text().trim(),
      url: `https://twitter.com/${userId}/status/${statusId}`
    }
  }

  const hasParent = $('.timeline.inreplytos table').length !== 0
  const hasMedia = $('.tweet-detail .media img').length !== 0

  if (hasMedia) {
    response.media = {
      url: $('.tweet-detail .media img').attr('src').replace(':small', '')
    }
  }

  if (hasParent) {
    response.parent = {
      url: `https://twitter.com${$('.timeline.inreplytos table')
        .last()
        .attr('href')}`
    }
  }

  return res.status(200).send(response)
}

export default validateRequest(tweet)
