import React, { useState, useEffect } from 'react'
import { getSSITag, fetchFallbackHtml, remountScripts } from './utils'
import { SSIInlcudeProps } from './types'

export const SSIInclude = (props: SSIInlcudeProps) => {
  const initialHtml = getInitialHtml(props.tagId, props.client)
  const initialContent = initialHtml || getSSITag(props.url)
  const [content, setContent] = useState(initialContent)

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

const getInitialHtml = (tagId: string, client?: boolean): string | null => {
  if (client && window) {
    const element = window.document.getElementById(tagId);
    return element ? element.innerHTML : null
  }
  return null
}
