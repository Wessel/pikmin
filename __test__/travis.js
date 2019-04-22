const Pikmin = require('../');
const pikmin = new Pikmin.instance({
  name: 'main',
  autogen: true,
  format: `${Pikmin.colors.cyan('[%h:%m:%s]')} %l ${Pikmin.colors.green('->')} `,
  transports: [
    new Pikmin.ConsoleTransport({ process: process, name: 'info' })
  ]
});

pikmin.info('test');