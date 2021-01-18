import React from 'react'
import { render, waitFor, screen, cleanup } from '@testing-library/react'

jest.mock('../fetch_fallback_html', () => ({
  ...(jest.requireActual('../fetch_fallback_html')),
  fetchFallbackHtml: jest.fn((url) => Promise.resolve(`<div>partial for ${url}</div>`))
}))

jest.mock('../is_client_side', () => ({
  ...(jest.requireActual('../is_client_side')),
  isClientSide: jest.fn(() => false)
}))

import { fetchFallbackHtml } from '../fetch_fallback_html'
import { isClientSide } from '../is_client_side'

// tslint:disable-next-line: no-var-requires
const SSIInclude = require('../index').SSIInclude
const testId = 'react-ssi-include'

let container

describe('SSIInclude Component, server side', () => {

  beforeEach(() => {
    container = document.createElement('div')
  })

  afterEach(() => {
    cleanup()
    ;(fetchFallbackHtml as jest.MockedFunction<typeof fetchFallbackHtml>).mockClear()
    ;(isClientSide as jest.MockedFunction<typeof isClientSide>).mockClear()
  })

  it('should render the SSI virtual tag', async () => {
    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const { getByTestId } = render(<SSIInclude url={url} tagId={tagId} testId={testId} />, {
      container: document.body.appendChild(container)
    })

    await waitFor(() => {
      screen.getByTestId(testId)
    })

    const ssiInclude = getByTestId(testId)
    expect(ssiInclude).toBeDefined()
    expect(ssiInclude.innerHTML).toEqual(`<!--#include virtual="${url}" -->`)

    expect(fetchFallbackHtml).toBeCalledTimes(0)
  })

})
