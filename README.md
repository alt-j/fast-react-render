# [React] Server render [![Build Status](https://travis-ci.org/alt-j/fast-react-render.svg?branch=master)](https://travis-ci.org/alt-j/fast-react-render)

The module for rendering react-element in the server **3 times as fast** (see [benchmarks](https://github.com/alt-j/react-server-benchmark)) as [traditional react rendering](https://facebook.github.io/react/docs/environments.html) (in production mode).

## Quick start

All you need to use it, is only:

1) install package

```sh
npm install react-server-rendering
```

2) replace you render to:

```js
var ReactRender = require('fast-react-render');

var element = React.createElement(Component, {property: 'value'});
console.log(ReactRender.elementToString(element));
```

## What's next

If you need more perfomance, you can try use [fast-react-server](https://github.com/alt-j/fast-react-server) - is high speed mock for react, which provide rendering **15 times as fast** as traditional, but require more configuration for build system.
