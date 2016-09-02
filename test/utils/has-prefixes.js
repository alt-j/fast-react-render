var chai = require('chai');
var expect = chai.expect;
var hasPrefixes = require('../../src/utils/has-prefixes');

describe('hasPrefixes', function () {
    it('should be a function', function () {
        expect(hasPrefixes).to.be.a('function');
    });

    it('should find from one prefix', function () {
        expect(hasPrefixes('datatgrfed', ['data'])).to.equal(true);
    });

    it('should find from many prefixes', function () {
        expect(hasPrefixes('datatgrfed', ['data', 'other', 'd1ata'])).to.equal(true);
    });

    it('should not find', function () {
        expect(hasPrefixes('dattgrfed', ['data', 'other', 'd1ata'])).to.equal(false);
    });
});
