# service-rule-evaluator [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> service rule evaluator

## Installation

```sh
$ npm install --save service-rule-evaluator
```

## Usage

```js
const RuleEvaluator = require('service-rule-evaluator');

RuleEvaluator.evaluate('123', { eq: 123 });     // true
RuleEvaluator.evaluate('123', { lte: 123 });    // true
RuleEvaluator.evaluate('123', { gte: 123 });    // true
```

## License

MIT © [wangshijun](wangshijun2010@gmail.com)

[npm-image]: https://badge.fury.io/js/service-rule-evaluator.svg
[npm-url]: https://npmjs.org/package/service-rule-evaluator
[travis-image]: https://travis-ci.org/renrenche/service-rule-evaluator.svg?branch=master
[travis-url]: https://travis-ci.org/renrenche/service-rule-evaluator
[daviddm-image]: https://david-dm.org/renrenche/service-rule-evaluator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/renrenche/service-rule-evaluator
[coveralls-image]: https://coveralls.io/repos/renrenche/service-rule-evaluator/badge.svg
[coveralls-url]: https://coveralls.io/r/renrenche/service-rule-evaluator
