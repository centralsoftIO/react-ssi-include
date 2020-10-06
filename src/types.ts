import React from 'react'
export interface SSIInlcudeProps {
  client?: boolean
  tagId: string
  url: string
  onReady?: (error?: Error) => void
}

export declare const SSIInclude: React.FunctionComponent<SSIInlcudeProps>
