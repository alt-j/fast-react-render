var chai = require('chai');
var expect = chai.expect;
var attr = require('../../../src/utils/escape/attr');

describe('attr', function () {
    it('should be a function', function () {
        expect(attr).to.be.a('function');
    });

    it('should not change correct string', function () {
        var string = 'forbidden';
        expect(attr(string)).to.equal(string);
    });

    it('should escape `&` sign', function () {
        expect(attr('&')).to.equal('&amp;');
    });

    it('should escape `&` sign twice', function () {
        expect(attr('a=1&b=2&c=3')).to.equal('a=1&amp;b=2&amp;c=3');
    });

    it('should escape `"` sign', function () {
        expect(attr('"')).to.equal('&quot;');
    });

    it('should escape `"` sign twice', function () {
        expect(attr('"test"')).to.equal('&quot;test&quot;');
    });

    it('should escape `"` and `&` signs', function () {
        expect(attr('"rock&roll"')).to.equal('&quot;rock&amp;roll&quot;');
    });
});
