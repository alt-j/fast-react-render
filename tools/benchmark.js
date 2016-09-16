var run = require('fast-react-benchmark/run');
var tests = require('fast-react-benchmark/tests');

var React = require('react');
var ReactRender = require('../src/index');

run({
    'React + FastReactRender': tests['React + FastReactRender'],

    'React + This': {
        engine: React,
        run: function (listView, dataSet) {
            var element = React.createElement(listView, dataSet);
            return ReactRender.elementToString(element);
        }
    }
}, process.env.CHILDREN_COUNT || 100);
