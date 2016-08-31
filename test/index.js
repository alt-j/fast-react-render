var chai = require('chai');
var expect = chai.expect;
var ReactRender = require('../src/index');

describe('ReactRender', function () {
    describe('elementToString', function () {
        it('should be a function', function () {
            expect(ReactRender.elementToString).to.be.a('function');
        });
    });
});
