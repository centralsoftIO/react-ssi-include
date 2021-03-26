export function fetchFallbackHtml (url: string) {
  let basicAuthHeader: any
  try {
    const { origin, username, password, pathname } = new URL(url)
    if (username && password) {
      url = `${origin}${pathname}`
      basicAuthHeader = {
        Authorization: 'Basic ' + btoa(username + ':' + password)
      }
    }
  // eslint-disable-next-line no-empty
  // tslint:disable-next-line: no-empty
  } catch {}
  
  return fetch(url, {
    headers: basicAuthHeader
  })
}
