# React SSI Inlcude

React component for rendering Server Side Includes.

## Installation

### With NPM

`npm install --save react-ssi-include`

### With Yarn

`yarn add react-ssi-include`

## Usage

The component is meant to be used alongside Server Side Rendering (SSR).

```
import { SSIInclude } from 'react-ssi-include';

const Component = () => (
  <SSIInclude
    tagId="partial-container"
    url="https://example.com/some-partial"
    client={false} // `true` if running on client
    onReady={(err) => {
      if (err) {
        console.error(err)
      }
      // content is loaded
    }}
  />
)
```
