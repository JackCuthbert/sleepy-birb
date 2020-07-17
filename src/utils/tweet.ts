export interface TweetPayload {
  userId: string
  statusId: string
}

export function parseTweet(url: string): TweetPayload {
  const reg = /^https:\/\/(?:mobile)?.?twitter.com\/(.*?)\/.*?\/(\d+)/gi.exec(
    url
  )

  console.log(url)

  return {
    userId: reg[1],
    statusId: reg[2]
  }
}
