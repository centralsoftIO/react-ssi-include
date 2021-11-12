export function fetchFallbackHtml (url: string) {
  const headers: Record<string, string> = {
    Accept: 'text/html'
  }
  try {
    const { origin, username, password, pathname } = new URL(url)
    if (username && password) {
      url = `${origin}${pathname}`
      headers.Authorization = 'Basic ' + btoa(username + ':' + password)
    }
  // eslint-disable-next-line no-empty
  // tslint:disable-next-line: no-empty
  } catch {}

  const { controller, signal } = initAbortController()
  
  return {
    abort () {
      return controller && controller.abort()
    },
    ready () {
      return fetch(url, { headers, ...(signal ? { signal } : {}) })
    }
  }
}

function initAbortController () {
  try {
    const controller = new AbortController()
    const signal = controller.signal
    return { controller, signal }
  } catch (err) {
    return {}
  }
}
