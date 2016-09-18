var chai = require('chai');
var expect = chai.expect;
var isContain = require('../../src/utils/is-contain');

describe('isContain', function () {
    it('should be a function', function () {
        expect(isContain).to.be.a('function');
    });

    it('should find from one value array', function () {
        expect(isContain(['one'], 'one')).to.equal(true);
    });

    it('should find from many values array', function () {
        expect(isContain(['one', 'two', 'three', 'four'], 'three')).to.equal(true);
    });

    it('should not find', function () {
        expect(isContain(['one', 'two'], 'five')).to.equal(false);
    });
});
