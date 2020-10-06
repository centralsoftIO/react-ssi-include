import React, { useState, useEffect } from 'react'
import { getSSITag, fetchFallbackHtml, remountScripts } from './utils'
import { SSIInlcudeProps } from './types'

export const SSIInclude = (props: SSIInlcudeProps) => {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(getSSITag(props.url, props.client))
  useEffect(() => {
    if (props.client || content === getSSITag(props.url, props.client)) {
      setLoading(true)
      fetchFallbackHtml(props.url)
        .then(response => {
          setContent(response)
        })
        .catch(err => {
          setContent(err.message)
        })
        .finally(() => {
          if (props.onReady) {
            props.onReady()
          }
          setLoading(false)
        })
    }
    if (props.client && content) {
      remountScripts(props.tagId)
    }
  }, [content])

  if (loading) {
    return <p>Loading...</p>
  }

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
