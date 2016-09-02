/**
 * @param {String} str
 * @param {String[]} prefixes
 * @returns {Boolean} hasPrefixes
 */
module.exports = function (str, prefixes) {
    var i = prefixes.length;
    while (--i >= 0) {
        var j = prefixes[i].length;
        while (--j >= 0) {
            if (prefixes[i][j] !== str[j]) {
                j = -2;
            }
        }

        if (j === -1) {
            return true;
        }
    }

    return false;
};
