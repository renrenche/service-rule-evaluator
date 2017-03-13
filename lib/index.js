const _ = require('lodash');
const vm = require('vm');
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
 * 检查是否为有效的数据，不为 null
 */
const isValidData = data => (data !== null && ['number', 'string', 'boolean'].indexOf(typeof data) > -1);

/**
 * 判断某个值是否满足某个条件，或者多个值是否满足条件
 *
 * @param {String|Number} data 需要检查的值
 * @param {Object} rules 需要匹配的规则
 * @param {Object} 额外配置，比如是否在规则不合规时报错，是否在值不合规时报错
 * @return true | false
 */
const _isMatch = (data, rules, config) => {
    const { failOnInvalidRule = false } = config;

    // 如果 data 是多个，那个假设 rules 也是多个
    if (data && typeof data === 'object') {
        for (const key in rules) {
            if (_isMatch(data[key], rules[key], config) === false) {
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

        debug({ operator, data, threshold });
        // 值是否匹配规则
        switch (operator) {
            case 'lt':
                return Number(data) < Number(threshold);
            case 'lte':
                return Number(data) <= Number(threshold);
            case 'gt':
                return Number(data) > Number(threshold);
            case 'gte':
                return Number(data) >= Number(threshold);
            case 'eq':
                return data == threshold;   // eslint-disable-line
            case 'neq':
                return data != threshold;   // eslint-disable-line
            default:
                return false;
        }
    });
};

const isMatch = (data, rules = {}, config = {}) => {
    if (Array.isArray(rules)) {
        return !!_.some(rules, rule => _isMatch(data, rule, config));
    } else if (Object.keys(rules).length === 0) {
        return true;
    }

    return _isMatch(data, rules, config);
};

/**
 * 对给定的环境和表达式求值
 *
 * @param {String} operation 表达式，如 count + 1
 * @param {Object} env 求值环境，比如 { count: 1 }
 * @return mixed
 */
const evaluate = (operation, env = {}) => {
    const sandbox = Object.assign({}, env);

    try {
        const script = new vm.Script(operation);
        const context = new vm.createContext(sandbox);  // eslint-disable-line
        script.runInContext(context);
    } catch (e) {
        console.log('evaluate error:', e);
    }

    debug({
        sandbox
    });
    return sandbox;
};

module.exports = {
    evaluate,
    isMatch,
    isValidData,
};
