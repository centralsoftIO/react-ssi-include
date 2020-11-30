import React, { useState, useEffect } from 'react'

import { SSIInlcudeProps } from './types'

import { isClientSide, getInitialHtml, getSSITag, fetchFallbackHtml, remountScripts } from './utils'

export const SSIInclude = (props: SSIInlcudeProps) => {
  const initialHtml = getInitialHtml(props.tagId)
  const initialContent = initialHtml || getSSITag(props.url)
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    if (isClientSide() && content === getSSITag(props.url)) {
      fetchFallbackHtml(props.url)
        .then(response => {
          setContent(response)
          if (props.onReady) {
            const status = {
              type: 'warning',
              message: 'Resolved content client-side.'
            }
            props.onReady(null, status)
          }
        })
        .catch(err => {
          if (props.onReady) {
            const status = {
              type: 'error',
              message: 'Client-side fallback fetch failed.'
            }
            props.onReady(err, status)
          }
        })
    }
  }, [])

  useEffect(() => {
    if (isClientSide() && content !== getSSITag(props.url)) {
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
