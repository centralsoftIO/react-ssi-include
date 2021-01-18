export function fetchFallbackHtml (url: string): Promise<string> {
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

  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: basicAuthHeader
    })
      .then(res => {
        if (!res.ok) {
          reject(new Error(`Failed to load ${url}. Got status ${res.status}.`))
        }
        return res.text()
      })
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}
