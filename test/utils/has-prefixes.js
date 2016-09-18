var chai = require('chai');
var expect = chai.expect;
var hasPrefixes = require('../../src/utils/has-prefixes');

describe('hasPrefixes', function () {
    it('should be a function', function () {
        expect(hasPrefixes).to.be.a('function');
    });

    it('should find from one prefix', function () {
        expect(hasPrefixes(['data'], 'datatgrfed')).to.equal(true);
    });

    it('should find from many prefixes', function () {
        expect(hasPrefixes(['data', 'other', 'd1ata'], 'datatgrfed')).to.equal(true);
    });

    it('should not find', function () {
        expect(hasPrefixes(['data', 'other', 'd1ata'], 'dattgrfed')).to.equal(false);
    });
});
