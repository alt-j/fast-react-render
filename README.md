# [React] Server render [![Build Status](https://travis-ci.org/alt-j/fast-react-render.svg?branch=master)](https://travis-ci.org/alt-j/fast-react-render) [![Coverage Status](https://coveralls.io/repos/github/alt-j/fast-react-render/badge.svg?branch=master)](https://coveralls.io/github/alt-j/fast-react-render?branch=master)

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
console.log(ReactRender.elementToString(element, {context: {}}));
```

## Cache

React server rendering support cache for component.

First of all, you must choose cache system. It can be any system, which implement ICache interface ([interface](src/interfaces/i-cache.js)).
For caching, component must implement ICacheableComponent interface ([interface](src/interfaces/i-cacheable-component.js)).

Example with using LRU cache: [render with LRU cache](examples/cache.js) (install `lru-cache` package first).

## What's next

If you need more performance, you can try use [fast-react-server](https://github.com/alt-j/fast-react-server) - is high speed mock for react, which provide rendering **15 times as fast** as traditional, but require more configuration for build system.
