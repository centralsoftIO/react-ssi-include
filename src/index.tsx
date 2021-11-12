import React, { useState, useEffect } from 'react'

import { SSIIncludeProps } from './types'

import { isClientSide } from './is_client_side'
import { fetchFallbackHtml } from './fetch_fallback_html'
import { getInitialHtml, getSSITag, remountScripts } from './utils'

export const SSIInclude = (props: SSIIncludeProps) => {
  const initialContent = isClientSide() ? (getInitialHtml(props.tagId) || '') : getSSITag(props.url)
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    let triggerRequestAbortion = () => {/* noop */}

    if (isClientSide() && (content === getSSITag(props.url) || content === '')) {
      const request = fetchFallbackHtml(props.url)
      triggerRequestAbortion = () => request.abort()
      request.ready()
        .then(response => {
          return response.text()
            .then((data) => ({ response, data }))
            .catch(() => ({ response, data: '' }))
        })
        .then(result => {
          const { response, data } = result
          if (!response.ok) {
            throw new Error(
              `Failed to successfully load ${props.url}. Got status ${response.status}${data ? ` with response text "${data}"` : ''}.`
            )
          }

          setContent(data)
          if (props.onClientSideFetch) {
            const status = {
              type: 'warning',
              message: 'Resolved content client-side.'
            }
            props.onClientSideFetch(null, status)
          }
        })
        .catch(err => {
          if (err.name === 'AbortError') return

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

    return () => {
      triggerRequestAbortion()
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
