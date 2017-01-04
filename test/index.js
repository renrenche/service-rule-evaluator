const expect = require('chai').expect;
const evaluator = require('../lib');

describe('service-rule-evaluator', function () {
    describe('#evaluate', function () {
        it('should have #evaluate method', function () {
            expect(evaluator.evaluate).to.be.a('function');
        });

        it('should return true on empty condition', function () {
            expect(evaluator.evaluate(true, {})).to.be.equal(true);
            expect(evaluator.evaluate(false, {})).to.be.equal(true);
            expect(evaluator.evaluate(0, {})).to.be.equal(true);
        });

        it('should return false on null values', function () {
            expect(evaluator.evaluate(null, {})).to.be.equal(false);
        });

        it('should work as expected on single condition', function () {
            expect(evaluator.evaluate(1, { gt: 0 })).to.be.equal(true);
            expect(evaluator.evaluate(1, { gte: 1 })).to.be.equal(true);
            expect(evaluator.evaluate(1, { gt: 1 })).to.be.equal(false);
        });

        it('should work expected on multiple condition', function () {
            expect(evaluator.evaluate(1, { gt: 0, lt: 2 })).to.be.equal(true);
            expect(evaluator.evaluate(1, { gte: 1, lt: 2 })).to.be.equal(true);
            expect(evaluator.evaluate(1, { gte: 1, lte: 2 })).to.be.equal(true);
            expect(evaluator.evaluate(1, { gt: 1, lt: 2 })).to.be.equal(false);
        });

        it('should work expected with boolean values', function () {
            expect(evaluator.evaluate(true, { gt: 0, lt: 2 })).to.be.equal(true);
            expect(evaluator.evaluate(true, { gte: 1, lt: 2 })).to.be.equal(true);
            expect(evaluator.evaluate(true, { gt: 1, lt: 2 })).to.be.equal(false);
            expect(evaluator.evaluate(true, { gt: 1, lte: 2 })).to.be.equal(false);
            expect(evaluator.evaluate(true, { eq: 1 })).to.be.equal(true);
        });

        it('should work expected with invalid operators', function () {
            expect(evaluator.evaluate(true, { gt: 0, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
            expect(evaluator.evaluate(true, { gte: 1, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
            expect(evaluator.evaluate(true, { gt: 1, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
        });

        it('should work expected with multiple rules: 1 key', function () {
            expect(evaluator.evaluate({ age: 10 }, { age: { lt: 0 } })).to.be.equal(false);
            expect(evaluator.evaluate({ age: 10 }, { age: { gte: 10 } })).to.be.equal(true);
            expect(evaluator.evaluate({ age: 10 }, { age: { gt: 10 } })).to.be.equal(false);
            expect(evaluator.evaluate({ age: 10 }, { age: { lte: 10 } })).to.be.equal(true);
            expect(evaluator.evaluate({ age: 10 }, { age: { lt: 10 } })).to.be.equal(false);
        });

        it('should work expected with multiple rules: empty rule => true', function () {
            expect(evaluator.evaluate({ age: 10 }, {})).to.be.equal(true);
        });

        it('should work expected with multiple rules: missing data => false', function () {
            expect(evaluator.evaluate({ age: 10 }, { age: { lte: 10 }, gender: { eq: 0 } })).to.be.equal(false);
        });

        it('should work expected with multiple rules: n key', function () {
            expect(evaluator.evaluate({ age: 10, gender: 0 }, { age: { lte: 10 }, gender: { eq: 0 } })).to.be.equal(true);
            expect(evaluator.evaluate({ age: 10, gender: 0 }, { age: { lte: 10 }, gender: { neq: 0 } })).to.be.equal(false);
        });
    });

    describe('#isValidData', function () {
        it('should have #isValidData method', function () {
            expect(evaluator.isValidData).to.be.a('function');
        });

        it('should identify invalid data', function () {
            expect(evaluator.isValidData()).to.be.equal(false);
            expect(evaluator.isValidData(null)).to.be.equal(false);
            expect(evaluator.isValidData({})).to.be.equal(false);
            expect(evaluator.isValidData('xxx')).to.be.equal(false);
        });

        it('should identify valid data', function () {
            expect(evaluator.isValidData(true)).to.be.equal(true);
            expect(evaluator.isValidData(false)).to.be.equal(true);
            expect(evaluator.isValidData(123)).to.be.equal(true);
            expect(evaluator.isValidData('123')).to.be.equal(true);
        });
    });
});
