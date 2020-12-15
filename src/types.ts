import React from 'react'

export interface SSIIncludeProps {
  tagId: string
  testId?: string
  url: string
  onClientSideFetch?: (error: Error | null, status: { type: string, message: string }) => void
}

export declare const SSIInclude: React.FunctionComponent<SSIIncludeProps>
