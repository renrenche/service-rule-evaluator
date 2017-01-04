const _ = require('lodash');
const pkgInfo = require('../package.json');
const debug = require('debug')(`${pkgInfo.name}@${pkgInfo.version}`);

// 有效的操作符
const VALID_OPERATORS = {
    lt: '<',
    lte: '<=',
    gt: '>',
    gte: '>=',
    eq: '==',
    neq: '!=',
};

/**
 * 检查是否为有效的数据，不为 null，且能被转化为数字
 */
const isValidData = data => (data !== null && isNaN(Number(data)) === false);

/**
 * 判断某个值是否满足某个条件，或者多个值是否满足条件
 *
 * @param {String|Number} data 需要检查的值
 * @param {Object} rules 需要匹配的规则
 * @param {Object} 额外配置，比如是否在规则不合规时报错，是否在值不合规时报错
 * @return true | false
 */
const evaluate = (data, rules = {}, config = {}) => {
    const { failOnInvalidRule = false, failOnInvalidData = true } = config;

    // 如果 data 是多个，那个假设 rules 也是多个
    if (data && typeof data === 'object') {
        for (let key in rules) {
            if (evaluate(data[key], rules[key], config) === false) {
                return false;
            }
        }

        return true;
    }

    // 以下是 data 为单个值的情形
    if (isValidData(data) === false) {
        debug('invalid data');
        return false;
    }

    return _.every(rules, (threshold, operator) => {
        // 校验规则有效性，可以选择性的忽略无效的规则
        if (typeof VALID_OPERATORS[operator] === 'undefined') {
            if (failOnInvalidRule) {
                debug(`invalid operator ${operator}`);
                return false;
            }
        }

        data = Number(data);
        threshold = Number(threshold);

        // 值是否匹配规则
        switch (operator) {
            case 'lt':
                return data < threshold;
            case 'lte':
                return data <= threshold;
            case 'gt':
                return data > threshold;
            case 'gte':
                return data >= threshold;
            case 'eq':
                return data == threshold;
            case 'neq':
                return data != threshold;
        }

        /* istanbul ignore next: not reachable */
        return true;
    });
};

module.exports = {
    evaluate,
    isValidData,
};
