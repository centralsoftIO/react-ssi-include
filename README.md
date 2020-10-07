# React SSI Include

React component for rendering Server Side Includes (SSI) with f.e. nginx.

## Installation

### With NPM

`npm install --save react-ssi-include`

### With Yarn

`yarn add react-ssi-include`

## Usage

The component is meant to be used alongside Server Side Rendering (SSR).
Tested with next.js (SSR) and a fronting nginx (k8s).

```
import { SSIInclude } from 'react-ssi-include';

const isOnClient = typeof window !== "undefined"

const Component = () => (
  <SSIInclude
    tagId="partial-container"
    url="https://example.com/some-partial"
    client={isOnClient} // falls back to load the include client side in case SSI didn't work
    onReady={(err) => {
      if (err) {
        console.error(err)
      }
      // content is loaded
    }}
  />
)
```

## Notes

In case you plan to use this on a kubernetes cluster, then double check whether the ssi nginx core module is available with your current ingress controller. In case it's not, you might want to replace it with a different one, see https://github.com/nginxinc/kubernetes-ingress/blob/master/docs/nginx-ingress-controllers.md
