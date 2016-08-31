var ATTRS_TYPES = ['string', 'boolean', 'number'];

var extend = require('./utils/extend');

var escapeHtml = require('./utils/escape/html');
var escapeAttr = require('./utils/escape/attr');

var dasherize = require('./utils/dasherize');

/**
 * @typedef {Object} RenderElement
 * @property {Function|String} element.type
 * @property {Object} element.props
 */

module.exports = {
    /**
     * @param {ReactElement} element
     * @param {ICache} [cache]
     * @returns {String} html
     */
    elementToString: function (element, cache) {
        return renderElement(element, {
            cache: cache,
            context: {}
        });
    }
};

/**
 * @param {RenderElement} element
 * @param {Object} [options]
 * @param {ICache} [options.cache] Cache instance.
 * @param {Object} [options.context] Render context.
 * @returns {String} html
 */
function renderElement(element, options) {
    var Type = element.type;

    var props = element.props;
    var children = [].concat(props.children);

    if (typeof Type === 'string') {
        var content = '';
        if (props.dangerouslySetInnerHTML) {
            content = props.dangerouslySetInnerHTML.__html;
        } else if (children.length > 0) {
            content = renderChildren(children, options);
        }

        return '<' + Type + renderAttrs(props) + '>' + content + '</' + Type + '>';
    } else if (typeof Type === 'function') {
        var instance = new element.Type(props, options.context);

        var context = options.context;
        if (typeof instance.getChildContext === 'function') {
            context = extend(context, instance.getChildContext());
        }

        return renderElement(instance.render(), extend(options, {context: context}));
    }

    return '';
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
