# service-rule-evaluator [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> service rule evaluator

## Installation

```sh
$ npm install --save @rrc/service-rule-evaluator
or
$ yarn add @rrc/service-rule-evaluator -S
```

## Usage

```js
const evaluator = require('@rrc/service-rule-evaluator');

// 判断是否匹配
evaluator.isMatch('123', { eq: 123 });     // true
evaluator.isMatch('123', { lte: 123 });    // true
evaluator.isMatch('123', { gte: 123 });    // true

// 解释和执行
evaluator.evaluate('count=count+1', { count: 20 });     // { count: 21 }
evaluator.evaluate('count=count  -1', { count: 20 };    // { count: 19 }
evaluator.evaluate('count=count*  3', { count: 20 });   // { count: 60 }
evaluator.evaluate('count=count  /  2', { count: 20 }); // { count: 10 }
evaluator.evaluate('count = Math.max(count/increment, increment*2);', { count: 20, increment: 2 });     // { count: 10 }
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
