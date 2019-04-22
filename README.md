<img src="https://wessel.meek.moe/pikmin/thumb.png" align="left" width="180px" height="100%"/>
<img align="left" width="0" height="192px" hspace="10"/>

<a href="https://github.com/PassTheWessel/pikmin">Pikmin</a> - A lightweight, customizable Node.JS logger

[![MIT License](https://img.shields.io/badge/license-MIT-007EC7.svg?style=flat-square)](/LICENSE) [![Travis Build Status](https://img.shields.io/travis/com/PassTheWessel/pikmin.svg?style=flat-square)](https://travis-ci.com/PassTheWessel/pikmin) [![NPM downloads](https://img.shields.io/npm/dm/pikmin.svg?style=flat-square)](https://npmjs.com/package/pikmin)


Pikmin is a fast and highly customizable logger for Node.JS with various custom transports

[`GitHub`](https://github.com/PassTheWessel/pikmin) **|** [`NPM`](https://npmjs.com/package/pikmin)

<br>

## Installing
```sh
$ yarn add pikmin # Install w/ Yarn
$ npm i pikmin # Install w/ NPM
```

## Example
```js
// main.js
const Pikmin = require('pikmin');
const pikmin = new Pikmin.instance({
  name: 'main',
  autogen: true,
  format: `${Pikmin.colors.cyan('[%h:%m:%s]')} %l ${Pikmin.colors.green('->')} `,
  transports: [
    new Pikmin.FileTransport({ file: 'tmp/log.txt' }),
    new Pikmin.ConsoleTransport({ process: process, name: 'info' })
  ]
});

pikmin.addTransport(new Pikmin.ConsoleTransport({ process: process, name: 'error', format: `${Pikmin.colors.red('%l')}`, defaults: {} }));
Pikmin.bind(pikmin, console);

pikmin.info(Symbol.iterator);
pikmin.info({ 'test': 123 });
pikmin.error('This is an error!');

require('./global.js')();
Pikmin.unbind(pikmin);

// global.js
const { loggers, colors } = require('../');
const log = loggers.get('main');

module.exports = () => {
  log.info(`Method "${colors.green('info')}" is global`);
  console.pikmin.error('Oh no!');
};
```

## Showcase 
![showcase](https://mrsheldon.me/files/86116428.png)

## Documentation
Documentation can be found at [https://github.com/PassTheWessel/pikmin/wiki](https://github.com/PassTheWessel/pikmin/wiki)
