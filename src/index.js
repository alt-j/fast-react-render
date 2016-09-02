var ATTRS_TYPES = ['string', 'boolean', 'number'];
var SELF_CLOSING_TAGS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var uuid = require('uuid');

var extend = require('./utils/extend');

var escapeHtml = require('./utils/escape/html');
var escapeAttr = require('./utils/escape/attr');

var dasherize = require('./utils/dasherize');

/**
 * @typedef {Object} RenderElement
 * @property {Function|String} element.type
 * @property {Object} element.props
 */

/**
 * @param {ReactElement} element
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @returns {String} html
 */
function renderElement(element, options) {
    var type = element.type;
    var props = element.props;

    if (typeof type === 'string') {
        var content = '';
        if (props.dangerouslySetInnerHTML) {
            content = props.dangerouslySetInnerHTML.__html;
        } else if (props.children) {
            content = renderChildren([].concat(props.children), options);
        }

        var attrs = renderAttrs(props);
        if (SELF_CLOSING_TAGS.indexOf(type) !== -1) {
            return '<' + type + attrs + ' />' + content;
        }

        return '<' + type + attrs + '>' + content + '</' + type + '>';
    } else if (typeof type === 'function') {
        if (typeof type.prototype.render === 'function') {
            return renderComponent(type, props, options);
        } else {
            return renderElement(type(props));
        }
    }

    return '';
}

/**
 * @param {Function} Component
 * @param {Object} props
 * @param {Object} [options]
 * @param {ICache} [options.cache]
 * @param {Object} [options.context]
 * @returns {String} html
 */
function renderComponent(Component, props, options) {
    var context = (options && options.context) || {};
    var instance = new Component(props, context);

    var hasCache = typeof instance.getCacheKey === 'function';
    if (hasCache) {
        Component._renderCachePrefix = Component._renderCachePrefix || Component.displayName || uuid.v1();
    }

    var cache = options && options.cache;
    var cacheKey = cache && hasCache ? Component._renderCachePrefix + instance.getCacheKey() : null;

    if (cacheKey && cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    if (typeof instance.getChildContext === 'function') {
        context = extend(context, instance.getChildContext());
    }

    var html = renderElement(instance.render(), extend(options, {context: context}));

    if (cacheKey) {
        cache.set(cacheKey, html);
    }

    return html;
}

/**
 * @param {String[]|String[][]|Number[]|Number[][]} children
 * @param {Object} [options]
 * @param {ICache} [options.cache] Cache instance.
 * @param {Object} [options.context] Render context.
 * @returns {String} html
 */
function renderChildren(children, options) {
    var str = '';

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (typeof child === 'string') {
            str += escapeHtml(child);
        } else if (Array.isArray(child)) {
            str += renderChildren(child, options);
        } else if (typeof child === 'object') {
            str += renderElement(child, options);
        } else if (typeof child === 'number') {
            str += child;
        }
    }

    return str;
}

/**
 * @param {Object} attrs
 * @returns {String} str
 */
function renderAttrs(attrs) {
    var str = '';

    for (var key in attrs) {
        var value = key === 'style' ? renderStyle(attrs[key]) : attrs[key];

        if (!value ||
            key === 'children' || key === 'key' ||
            ATTRS_TYPES.indexOf(typeof value) === -1
        ) {
            continue;
        }

        var attr = key;
        if (key === 'htmlFor') {
            attr = 'for';
        } else if (key === 'className') {
            attr = 'class';
        }

        str += ' ' + attr;

        if (typeof value !== 'boolean') {
            str += '="' + (typeof value === 'string' ? escapeAttr(value) : value) + '"';
        }
    }

    return str;
}

/**
 * @param {Object} style
 * @returns {String} result
 */
function renderStyle(style) {
    var str = '';
    for (var property in style) {
        str += dasherize(property) + ': ' + style[property] + ';';
    }
    return str;
}

module.exports = {
    elementToString: renderElement
};
