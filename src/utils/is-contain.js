/**
 * @param {String[]} array
 * @param {String} value
 * @returns {Boolean} isContain
 */
module.exports = function (array, value) {
    var i = array.length;
    while (i-- > 0) {
        if (value === array[i]) {
            return true;
        }
    }

    return false;
};
