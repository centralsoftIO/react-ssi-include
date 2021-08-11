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
  
  return fetch(url, { headers })
}
