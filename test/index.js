var chai = require('chai');
var expect = chai.expect;
var React = require('react');
var LRU = require('lru-cache');
var ReactRender = require('../src/index');
var extend = require('../src/utils/extend');

describe('ReactRender', function () {
    describe('elementToString', function () {
        it('should be a function', function () {
            expect(ReactRender.elementToString).to.be.a('function');
        });

        it('should render null correctly', function () {
            var element = React.createElement(null);
            expect(ReactRender.elementToString(element)).to.equal('');
        });

        it('should render tag correctly', function () {
            var element = React.createElement('div');
            var expectString = '<div></div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render tag with attributes correctly', function () {
            var element = React.createElement('a', {
                href: '//ya.ru',
                className: 'link',
                id: 'link-1',
                target: '_blank',
                title: 'Link will be open in new tab'
            }, 'Test link');
            var expectString = '<a href="//ya.ru" class="link" id="link-1" ' +
                'target="_blank" title="Link will be open in new tab">Test link</a>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render tag with children correctly', function () {
            var element = React.createElement('div', null,
                React.createElement('hr'), React.createElement('p', null, '<br />Paragraph'));
            var expectString = '<div><hr /><p>&lt;br /&gt;Paragraph</p></div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render tag with dangerouse html correctly', function () {
            var element = React.createElement('div', {
                dangerouslySetInnerHTML: {__html: '<b>Bold</b>'}
            });
            var expectString = '<div><b>Bold</b></div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render tag with styles correctly', function () {
            var element = React.createElement('div', {
                style: {
                    backgroundColor: 'red',
                    borderBottomWidth: '10px'
                }
            }, 'Stylish');
            var expectString = '<div style="background-color: red;border-bottom-width: 10px;">Stylish</div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render self-closing tag correctly', function () {
            var element = React.createElement('input');
            var expectString = '<input />';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render self-closing tag with attributes correctly', function () {
            var element = React.createElement('input', {
                type: 'password',
                value: 'pass',
                readOnly: true
            });
            var expectString = '<input type="password" value="pass" readOnly />';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render self-closing tag with content correctly', function () {
            var element = React.createElement('input', {
                type: 'password',
                value: 'pass',
                maxLength: 1,
                readOnly: false
            }, 'Content');
            var expectString = '<input type="password" value="pass" maxLength="1" />Content';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render complex element correctly', function () {
            var element = React.createElement(
                'div',
                {className: 'password'},
                React.createElement('label', {htmlFor: 'pass'}, 'Password label'),
                React.createElement('input', {type: 'password', id: 'pass'})
            );
            var expectString = '<div class="password"><label for="pass">Password label</label>' +
                '<input type="password" id="pass" /></div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render simple component correctly', function () {
            var Component = React.createClass({
                render: function () {
                    return React.createElement('div', null, 'Component');
                }
            });
            var element = React.createElement(Component);
            var expectString = '<div>Component</div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render component with props correctly', function () {
            var Component = React.createClass({
                render: function () {
                    return React.createElement('div', null, 'Component ' + this.props.name);
                }
            });
            var element = React.createElement(Component, {name: 'block'});
            var expectString = '<div>Component block</div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render component with array of children correctly', function () {
            var Component = React.createClass({
                render: function () {
                    return React.createElement(
                        'div',
                        {className: 'list'},
                        'Items: ',
                        this.props.items.length,
                        this.props.items.map(function (item, i) {
                            return React.createElement('div', {className: 'item', key: i}, item);
                        }),
                        function () {
                            return 'Function does not render.';
                        }
                    );
                }
            });
            var element = React.createElement(Component, {items: ['a', 'b']});
            var expectString = '<div class="list">' +
                'Items: 2' +
                '<div class="item">a</div>' +
                '<div class="item">b</div>' +
                '</div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render component with array of children correctly', function () {
            var Item = React.createClass({
                render: function () {
                    var props = extend(this.props);
                    var tag = props.tag;
                    delete props.tag;
                    return React.createElement(tag, props);
                }
            });

            var Component = React.createClass({
                render: function () {
                    return React.createElement(
                        'div',
                        {className: 'list'},
                        this.props.items.map(function (item, i) {
                            return React.createElement(
                                Item,
                                {className: 'item', key: i, tag: 'div'},
                                'Subtitle' + i,
                                item.map(function (subitem, j) {
                                    return React.createElement(Item, {key: j, tag: 'span'}, subitem);
                                })
                            );
                        })
                    );
                }
            });
            var element = React.createElement(Component, {items: [['a', 'b'], ['c']]});
            var expectString = '<div class="list">' +
                '<div class="item">Subtitle0<span>a</span><span>b</span></div>' +
                '<div class="item">Subtitle1<span>c</span></div>' +
                '</div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render component with array of children correctly', function () {
            var Context = React.createClass({
                getInitialState: function () {
                    return {
                        name: 'Aeron'
                    };
                },
                getChildContext: function () {
                    return {
                        name: this.state.name
                    };
                },
                render: function () {
                    return React.createElement('div', null, this.props.children);
                }
            });

            var Component = React.createClass({
                render: function () {
                    return React.createElement(
                        'span',
                        {className: 'name'},
                        'Name: ' + this.context.name
                    );
                }
            });
            var element = React.createElement(Context, null, React.createElement(Component));
            var expectString = '<div><span class="name">Name: Aeron</span></div>';
            expect(ReactRender.elementToString(element)).to.equal(expectString);
        });

        it('should render component with passing context object correctly', function () {
            var Component = React.createClass({
                render: function () {
                    return React.createElement(
                        'span',
                        {className: 'name'},
                        'Name: ' + this.context.name
                    );
                }
            });

            var element = React.createElement(Component);
            var expectString = '<span class="name">Name: Aeron</span>';
            expect(ReactRender.elementToString(element, {context: {name: 'Aeron'}})).to.equal(expectString);
        });

        it('should render from cache correctly', function () {
            var content = 'Some <b>bold</b> text';
            var cache = LRU({
                max: 500,
                maxAge: 60 * 60
            });
            var Component = React.createClass({
                displayName: 'Component',

                getDefaultProps: function () {
                    return {
                        content: content
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

            var element = React.createElement(Component);
            var expectString = '<div class="text">' + content + '</div>';
            expect(ReactRender.elementToString(element, {cache: cache})).to.equal(expectString);
            expect(cache.itemCount).to.equal(1);
            expect(cache.values()[0]).to.equal(expectString);

            var cacheElement = React.createElement(Component, {content: content});
            expect(ReactRender.elementToString(cacheElement, {cache: cache})).to.equal(expectString);
        });

        it('should render from cache without displayName correctly', function () {
            var content = 'Some <b>bold</b> text';
            var cache = LRU({
                max: 500,
                maxAge: 60 * 60
            });
            var Component = React.createClass({
                getDefaultProps: function () {
                    return {
                        content: content
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

            var element = React.createElement(Component);
            var expectString = '<div class="text">' + content + '</div>';
            expect(ReactRender.elementToString(element, {cache: cache})).to.equal(expectString);
            expect(cache.itemCount).to.equal(1);
        });

        it('should render from cache without getCacheKey correctly', function () {
            var content = 'Some <b>bold</b> text';
            var cache = LRU({
                max: 500,
                maxAge: 60 * 60
            });
            var Component = React.createClass({
                getDefaultProps: function () {
                    return {
                        content: content
                    };
                },

                render: function () {
                    return React.createElement('div', {
                        className: 'text',
                        dangerouslySetInnerHTML: {__html: this.props.content}
                    });
                }
            });

            var element = React.createElement(Component);
            var expectString = '<div class="text">' + content + '</div>';
            expect(ReactRender.elementToString(element, {cache: cache})).to.equal(expectString);
            expect(cache.itemCount).to.equal(0);
        });
    });
});
