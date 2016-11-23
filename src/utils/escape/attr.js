/**
 * @param {String} value
 * @returns {String} result
 */
module.exports = function (value) {
    var escapeAmp = false;
    var escapeQuot = false;

    var i = value.length;
    while (--i >= 0) {
        if (value[i] === '&' && !escapeAmp) {
            escapeAmp = true;
        } else if (value[i] === '"' && !escapeQuot) {
            escapeQuot = true;
        }
    }

    if (escapeAmp) {
        value = value.replace(/&/g, '&amp;');
    }
    if (escapeQuot) {
        value = value.replace(/"/g, '&quot;');
    }

    return value;
};
