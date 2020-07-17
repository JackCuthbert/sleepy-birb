import React, { FC, useState } from 'react'

export const ExpandMedia: FC = props => {
  const [isExpanded, setExpanded] = useState(false)

  return (
    <>
      <div className="border border p-2 rounded bg-light">
        {!isExpanded ? (
          <p>
            This tweet contains some kind of media that might not be viewable as
            intended here (gifs and videos). To view source material open the
            tweet on Twitter.com.
          </p>
        ) : null}
        <p className={!isExpanded ? 'mb-0' : 'mb-0 mt-0'}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault()
              setExpanded(!isExpanded)
            }}
          >
            {isExpanded ? 'Hide' : 'Show'} media
          </a>
        </p>
      </div>
      {isExpanded ? props.children : null}
    </>
  )
}
