import React, { useState, useEffect } from 'react'
import { getSSITag, fetchFallbackHtml, remountScripts } from './utils'
import { SSIInlcudeProps } from './types'

export const SSIInclude = (props: SSIInlcudeProps) => {
  const [content, setContent] = useState(getSSITag(props.url))

  useEffect(() => {
    if (props.client || content === getSSITag(props.url)) {
      fetchFallbackHtml(props.url)
        .then(response => {
          setContent(response)
          if (props.onReady) {
            props.onReady()
          }
        })
        .catch(err => {
          if (props.onReady) {
            props.onReady(err)
          }
        })
    }
  }, [])

  useEffect(() => {
    if (props.client && content) {
      remountScripts(props.tagId)
    }
  }, [content])

  return (
    <div
      id={props.tagId}
      dangerouslySetInnerHTML={{
        __html: content
      }}
      suppressHydrationWarning={true}
    />
  )
}
