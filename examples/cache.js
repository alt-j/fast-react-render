/* eslint-disable no-console */

// You must install all dependencies (react, lru-cache).
var React = require('react');
var ReactRender = require('../src/index');

var LRU = require('lru-cache');
var cache = LRU({
    max: 500,
    maxAge: 60 * 60
});

var Component = React.createClass({
    displayName: 'Component',

    getDefaultProps: function () {
        return {
            content: 'Some <b>bold</b> text'
        };
    },

    getCacheKey: function () {
        return this.props.content;
    },

    render: function () {
        return React.createElement('div', {
            className: 'text',
            dangerouslySetInnerHTML: {__html: this.props.content}
        });
    }
});

console.log(
    ReactRender.elementToString(
        React.createElement(Component),
        {cache: cache}
    )
);

// Render from cache
console.log(
    ReactRender.elementToString(
        React.createElement(Component, {content: 'Some <b>bold</b> text'}),
        {cache: cache}
    )
);
