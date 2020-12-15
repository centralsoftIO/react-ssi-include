import React from 'react'
import ReactDOM from 'react-dom'
import { render, waitFor, screen, act, cleanup } from '@testing-library/react'

const fetchFallbackHtml = require('../fetch_fallback_html')
const mockFetchFallbackHtml =
  jest.fn((url) => Promise.resolve(`<div>partial for ${url}</div>`)) as jest.MockedFunction<typeof fetchFallbackHtml>
jest.mock('../fetch_fallback_html', () => mockFetchFallbackHtml)

const isClientSide = require('../is_client_side')
const mockIsClientSide = jest.fn(() => true) as jest.MockedFunction<typeof isClientSide>
jest.mock('../is_client_side', () => mockIsClientSide)

const SSIInclude = require('../index').SSIInclude
const testId = 'react-ssi-include'

let container

describe('SSIInclude Component, client side', () => {

  beforeEach(() => {
    container = document.createElement('div')
  })

  afterEach(() => {
    cleanup()
    mockFetchFallbackHtml.mockClear()
    mockIsClientSide.mockClear()
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
      screen.getAllByTestId('server-response')
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

    expect(mockFetchFallbackHtml).toBeCalledTimes(0)
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
      screen.getAllByTestId('server-response')
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

    expect(mockFetchFallbackHtml).toBeCalledTimes(1)
    expect(mockFetchFallbackHtml).toBeCalledWith(url)
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
      screen.getAllByTestId('server-response')
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
    mockFetchFallbackHtml.mockImplementationOnce(() => Promise.reject(expectedError))

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
      screen.getAllByTestId('server-response')
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
