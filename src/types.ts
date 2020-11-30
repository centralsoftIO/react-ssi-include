import React from 'react'

export interface SSIInlcudeProps {
  tagId: string
  url: string
  onReady?: (error: Error | null, status: { type: string, message: string }) => void
}

export declare const SSIInclude: React.FunctionComponent<SSIInlcudeProps>
