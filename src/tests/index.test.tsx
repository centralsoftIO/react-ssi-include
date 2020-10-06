import React from 'react'
import { render, cleanup } from '@testing-library/react'

import { SSIInclude } from '../index'

describe('SSIInclude Component', () => {
  it('should render the SSI virtual tag', () => {
    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const result = render(<SSIInclude url={url} tagId={tagId} />)
    const tag = result.container.querySelectorAll(`#${tagId}`)
    expect(Array.from(tag)).toHaveLength(1)
  })
})
