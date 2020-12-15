import React, { useState, useEffect } from 'react'

import { SSIIncludeProps } from './types'

import isClientSide from './is_client_side'
import fetchFallbackHtml from './fetch_fallback_html'
import { getInitialHtml, getSSITag, remountScripts } from './utils'

export const SSIInclude = (props: SSIIncludeProps) => {
  const initialContent = isClientSide() ? (getInitialHtml(props.tagId) || '') : getSSITag(props.url)
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    if (isClientSide() && (content === getSSITag(props.url) || content === '')) {
      fetchFallbackHtml(props.url)
        .then(response => {
          setContent(response)
          if (props.onClientSideFetch) {
            const status = {
              type: 'warning',
              message: 'Resolved content client-side.'
            }
            props.onClientSideFetch(null, status)
          }
        })
        .catch(err => {
          if (props.onClientSideFetch) {
            const status = {
              type: 'error',
              message: `Client-side fallback fetch failed.${err ? ` ${err}` : ''}`
            }
            props.onClientSideFetch(err, status)
          }
        })
    }

    if (isClientSide() && content !== getSSITag(props.url) && content !== '') {
      remountScripts(props.tagId)
    }
  }, [content])

  if (!content) { return null }
  return (
    <div
      id={props.tagId}
      data-testid={props.testId}
      dangerouslySetInnerHTML={{
        __html: content
      }}
      suppressHydrationWarning={true}
    />
  )
}
