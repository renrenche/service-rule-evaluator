const expect = require('chai').expect;
const evaluator = require('../lib');

describe('service-rule-evaluator', function () {
    describe('#isMatch', function () {
        it('should have #isMatch method', function () {
            expect(evaluator.isMatch).to.be.a('function');
        });

        it('should return true on empty condition', function () {
            expect(evaluator.isMatch(true, {})).to.be.equal(true);
            expect(evaluator.isMatch(false, {})).to.be.equal(true);
            expect(evaluator.isMatch(0, {})).to.be.equal(true);
        });

        it('should work as expected on single condition', function () {
            expect(evaluator.isMatch(1, { gt: 0 })).to.be.equal(true);
            expect(evaluator.isMatch(1, { gte: 1 })).to.be.equal(true);
            expect(evaluator.isMatch(1, { gt: 1 })).to.be.equal(false);
        });

        it('should work expected on multiple condition', function () {
            expect(evaluator.isMatch(1, { gt: 0, lt: 2 })).to.be.equal(true);
            expect(evaluator.isMatch(1, { gte: 1, lt: 2 })).to.be.equal(true);
            expect(evaluator.isMatch(1, { gte: 1, lte: 2 })).to.be.equal(true);
            expect(evaluator.isMatch(1, { gt: 1, lt: 2 })).to.be.equal(false);
        });

        it('should work expected with boolean values', function () {
            expect(evaluator.isMatch(true, { gt: 0, lt: 2 })).to.be.equal(true);
            expect(evaluator.isMatch(true, { gte: 1, lt: 2 })).to.be.equal(true);
            expect(evaluator.isMatch(true, { gt: 1, lt: 2 })).to.be.equal(false);
            expect(evaluator.isMatch(true, { gt: 1, lte: 2 })).to.be.equal(false);
            expect(evaluator.isMatch(true, { eq: 1 })).to.be.equal(true);
        });

        it('should work expected with invalid operators', function () {
            expect(evaluator.isMatch(true, { gt: 0, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
            expect(evaluator.isMatch(true, { gte: 1, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
            expect(evaluator.isMatch(true, { gt: 1, xlt: 2 }, { failOnInvalidRule: true })).to.be.equal(false);
        });

        it('should work expected with multiple rules: 1 key', function () {
            expect(evaluator.isMatch({ age: 10 }, { age: { lt: 0 } })).to.be.equal(false);
            expect(evaluator.isMatch({ age: 10 }, { age: { gte: 10 } })).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10 }, { age: { gt: 10 } })).to.be.equal(false);
            expect(evaluator.isMatch({ age: 10 }, { age: { lte: 10 } })).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10 }, { age: { lt: 10 } })).to.be.equal(false);
        });

        it('should work expected with multiple rules: empty rule => true', function () {
            expect(evaluator.isMatch({ age: 10 }, {})).to.be.equal(true);
        });

        it('should work expected with multiple rules: missing data => false', function () {
            expect(evaluator.isMatch({ age: 10 }, { age: { lte: 10 }, gender: { eq: 0 } })).to.be.equal(false);
        });

        it('should work expected with multiple rules: n key', function () {
            expect(evaluator.isMatch({ age: 10, gender: 0 }, { age: { lte: 10 }, gender: { eq: 0 } })).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10, gender: 0 }, { age: { lte: 10 }, gender: { neq: 0 } })).to.be.equal(false);
        });

        it('should work expected with multiple rules: string compare', function () {
            expect(evaluator.isMatch({ age: 10, gender: 'male' }, { age: { lte: 10 }, gender: { eq: 'male' } })).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10, gender: 'male' }, { age: { lte: 10 }, gender: { neq: 'female' } })).to.be.equal(true);
        });

        it('should work expected with multiple rules groups', function () {
            expect(evaluator.isMatch({ age: 10, gender: 0 }, [{ age: { lte: 10 }, gender: { eq: 0 } }])).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10, gender: 0 }, [{ age: { lte: 5 }, gender: { neq: 0 } }])).to.be.equal(false);
            expect(evaluator.isMatch({ age: 10, gender: 0 }, [{ age: { lte: 9 } }, { gender: { eq: 0 } }])).to.be.equal(true);
            expect(evaluator.isMatch({ age: 10, gender: 0 }, [{ age: { lte: 9 } }, { age: { gt: 9 }, gender: { eq: 0 } }])).to.be.equal(true);
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
        });

        it('should identify valid data', function () {
            expect(evaluator.isValidData(true)).to.be.equal(true);
            expect(evaluator.isValidData(false)).to.be.equal(true);
            expect(evaluator.isValidData(123)).to.be.equal(true);
            expect(evaluator.isValidData('123')).to.be.equal(true);
        });
    });

    describe('#evaluate', function () {
        it('should have #evaluate method', function () {
            expect(evaluator.evaluate).to.be.a('function');
        });

        it('should evaluate correctly on empty sandbox', function () {
            expect(evaluator.evaluate('count=1', {}).count).to.equal(1);
            expect(evaluator.evaluate('count=-1', {}).count).to.equal(-1);
        });

        it('should evaluate correctly on single var sandbox', function () {
            expect(evaluator.evaluate('count=count+1', { count: 20 }).count).to.equal(21);
            expect(evaluator.evaluate('count=count  -1', { count: 20 }).count).to.equal(19);
            expect(evaluator.evaluate('count=count*  3', { count: 20 }).count).to.equal(60);
            expect(evaluator.evaluate('count=count  /  2', { count: 20 }).count).to.equal(10);
        });

        it('should evaluate correctly on multiple var sandbox', function () {
            expect(evaluator.evaluate('count=count+increment', { count: 20 }).count).to.equal(20);
            expect(evaluator.evaluate('count=count-increment', { count: 20, increment: 2 }).count).to.equal(18);
            expect(evaluator.evaluate('count=count*increment', { count: 20, increment: 2 }).count).to.equal(40);
            expect(evaluator.evaluate('count=count/increment', { count: 20, increment: 2 }).count).to.equal(10);
        });

        it('should evaluate multile operation correctly on multiple var sandbox', function () {
            expect(evaluator.evaluate('count=1; name="test";', {}).name).to.equal('test');
            expect(evaluator.evaluate('count=2; name="test";', { count: 20 }).count).to.equal(2);
        });

        it('should evaluate complex operation correctly on multiple var sandbox', function () {
            expect(evaluator.evaluate('count = count/increment - increment*2;', { count: 20, increment: 2 }).count).to.equal(6);
            expect(evaluator.evaluate('count = count/increment + increment*2;', { count: 20, increment: 2 }).count).to.equal(14);
            expect(evaluator.evaluate('count = Math.max(count/increment, increment*2);', { count: 20, increment: 2 }).count).to.equal(10);
            expect(evaluator.evaluate('count = Math.min(count/increment, increment*2);', { count: 20, increment: 2 }).count).to.equal(4);
        });
    });
});

