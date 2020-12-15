import React from 'react'
import { render, waitFor, screen, cleanup } from '@testing-library/react'

const fetchFallbackHtml = require('../fetch_fallback_html')
const mockFetchFallbackHtml = jest.fn((url) => Promise.resolve(`<div>partial for ${url}</div>`)) as jest.MockedFunction<typeof fetchFallbackHtml>
jest.mock('../fetch_fallback_html', () => mockFetchFallbackHtml)

const isClientSide = require('../is_client_side')
const mockIsClientSide = jest.fn(() => false) as jest.MockedFunction<typeof isClientSide>
jest.mock('../is_client_side', () => mockIsClientSide)

const SSIInclude = require('../index').SSIInclude
const testId = 'react-ssi-include'

let container

describe('SSIInclude Component, server side', () => {

  beforeEach(() => {
    container = document.createElement('div')
  })

  afterEach(cleanup)

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

    expect(mockFetchFallbackHtml).toBeCalledTimes(0)
  })

})
