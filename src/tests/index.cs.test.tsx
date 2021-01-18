import React from 'react'
import ReactDOM from 'react-dom'
import { render, waitFor, screen, act, cleanup } from '@testing-library/react'

jest.mock('../fetch_fallback_html', () => ({
  ...(jest.requireActual('../fetch_fallback_html')),
  fetchFallbackHtml: jest.fn((url) => Promise.resolve(`<div>partial for ${url}</div>`))
}))

jest.mock('../is_client_side', () => ({
  ...(jest.requireActual('../is_client_side')),
  isClientSide: jest.fn(() => true)
}))

import { fetchFallbackHtml } from '../fetch_fallback_html'
import { isClientSide } from '../is_client_side'

// tslint:disable-next-line: no-var-requires
const SSIInclude = require('../index').SSIInclude
const testId = 'react-ssi-include'

let container

describe('SSIInclude Component, client side', () => {

  beforeEach(() => {
    container = document.createElement('div')
  })

  afterEach(() => {
    cleanup()
    ;(fetchFallbackHtml as jest.MockedFunction<typeof fetchFallbackHtml>).mockClear()
    ;(isClientSide as jest.MockedFunction<typeof isClientSide>).mockClear()
  })

  it('should keep the present markup, no client side fetch and no onClientSideFetch call', async () => {
    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const serverSideHtml = '<p>Hello World</p>'
    const onClientSideFetchMock = jest.fn()

    container = document.body.appendChild(container)

    act(() => {
      ReactDOM.render(
      <div
        id={tagId}
        data-testid="server-response"
        dangerouslySetInnerHTML={{
          __html: serverSideHtml
        }}
      />,
        container
      )
    })

    await waitFor(() => {
      screen.getByTestId('server-response')
    })

    const { getByTestId } = render(
      <SSIInclude
        url={url}
        tagId={tagId}
        testId={testId}
        onClientSideFetch={onClientSideFetchMock}
      />,
      {
        container
      }
    )

    await waitFor(() => {
      screen.getByTestId(testId)
    })

    const ssiInclude = getByTestId(testId)
    expect(ssiInclude).toBeDefined()
    expect(ssiInclude.innerHTML).toEqual(serverSideHtml)

    expect(fetchFallbackHtml).toBeCalledTimes(0)
    expect(onClientSideFetchMock).toBeCalledTimes(0)
  })

  it('should fetch fallback client-side', async () => {
    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const serverSideHtml = `<!--#include virtual="${url}" -->`

    container = document.body.appendChild(container)

    act(() => {
      ReactDOM.render(
      <div
        id={tagId}
        data-testid="server-response"
        dangerouslySetInnerHTML={{
          __html: serverSideHtml
        }}
      />,
        container
      )
    })

    await waitFor(() => {
      screen.getByTestId('server-response')
    })

    const { getByTestId } = render(<SSIInclude url={url} tagId={tagId} testId={testId} />, {
      container
    })

    await waitFor(() => {
      screen.getByTestId(testId)
    })

    const ssiInclude = getByTestId(testId)
    expect(ssiInclude).toBeDefined()
    expect(ssiInclude.innerHTML).toEqual(`<div>partial for ${url}</div>`)

    expect(fetchFallbackHtml).toBeCalledTimes(1)
    expect(fetchFallbackHtml).toBeCalledWith(url)
  })

  it('should propagate status and warning via onClientSideFetch', async () => {
    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const serverSideHtml = `<!--#include virtual="${url}" -->`
    const onClientSideFetchMock = jest.fn()

    container = document.body.appendChild(container)

    act(() => {
      ReactDOM.render(
      <div
        id={tagId}
        data-testid="server-response"
        dangerouslySetInnerHTML={{
          __html: serverSideHtml
        }}
      />,
        container
      )
    })

    await waitFor(() => {
      screen.getByTestId('server-response')
    })

    render(
      <SSIInclude
        url={url}
        tagId={tagId}
        testId={testId}
        onClientSideFetch={onClientSideFetchMock}
      />,
      {
        container
      }
    )

    await waitFor(() => {
      screen.getByTestId(testId)
    })

    expect(onClientSideFetchMock).toBeCalledTimes(1)
    expect(onClientSideFetchMock).toBeCalledWith(
      null,
      expect.objectContaining({
        type: 'warning',
        message: 'Resolved content client-side.'
      })
    )
  })

  it('should propagate status and error via onClientSideFetch', async () => {
    const expectedError = new Error('Bad request')
    ;(fetchFallbackHtml as jest.MockedFunction<typeof fetchFallbackHtml>).mockImplementationOnce(() => Promise.reject(expectedError))

    const tagId = 'some-unique-id'
    const url = 'https://example.com'
    const serverSideHtml = `<!--#include virtual="${url}" -->`
    const onClientSideFetchMock = jest.fn()

    container = document.body.appendChild(container)

    act(() => {
      ReactDOM.render(
      <div
        id={tagId}
        data-testid="server-response"
        dangerouslySetInnerHTML={{
          __html: serverSideHtml
        }}
      />,
        container
      )
    })

    await waitFor(() => {
      screen.getByTestId('server-response')
    })

    render(
      <SSIInclude
        url={url}
        tagId={tagId}
        testId={testId}
        onClientSideFetch={onClientSideFetchMock}
      />,
      {
        container
      }
    )

    await waitFor(() => {
      screen.getByTestId(testId)
    })

    expect(onClientSideFetchMock).toBeCalledTimes(1)
    expect(onClientSideFetchMock).toBeCalledWith(
      expectedError,
      expect.objectContaining({
        type: 'error',
        message: 'Client-side fallback fetch failed. Error: Bad request'
      })
    )
  })

})
