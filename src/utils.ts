/* eslint-disable @typescript-eslint/no-explicit-any */
import isClientSide from './is_client_side'

export function getInitialHtml (id: string): string | null {
  if (!isClientSide()) {
    return null
  }

  const element = window.document.getElementById(id)
  return element ? element.innerHTML : null
}

export function getSSITag (url: string) {
  return `<!--#include virtual="${url}" -->`
}

export function remountScripts (id: string) {
  if (!isClientSide()) return

  const element = document.getElementById(id)
  if (element) {
    Array.prototype.slice.call(element.querySelectorAll('script'), 0).forEach(script => {
      const newScript = document.createElement('script')
      if (script.src) {
        if (script.getAttribute('type')) {
          newScript.setAttribute('type', script.getAttribute('type') || '')
        }
        if (script.getAttribute('nomodule') !== null) {
          newScript.setAttribute('nomodule', script.getAttribute('nomodule') || '')
        }
        newScript.src = script.src
      } else {
        newScript.textContent = script.textContent
      }
      document.body.appendChild(newScript)
    })
  }
}
