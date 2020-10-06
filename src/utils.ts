const getSSITag = (url: string, client?: boolean) => {
  if (client) {
    return ''
  }
  return `<!--#include virtual="${url}" -->`
}

const fetchFallbackHtml = (url: string): Promise<string> => {
  let basicAuthHeader: any
  try {
    const { origin, username, password, pathname } = new URL(url)
    if (username && password) {
      url = `${origin}${pathname}`
      basicAuthHeader = { key: 'Authorization', value: 'Basic ' + btoa(username + ':' + password) }
    }
  } catch {}

  return new Promise((resolve, reject) => {
    fetch(url, basicAuthHeader)
      .then(res => {
        if (!res.ok) {
          reject(`Failed to load ${url}. Got status ${res.status}.`)
        }
        return res.text()
      })
      .then(data => resolve(data))
  })
}

const remountScripts = (id: string) => {
  const document = window.document
  if (document) {
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
}

export { getSSITag, fetchFallbackHtml, remountScripts }
