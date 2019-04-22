const { loggers, colors } = require('../');
const log = loggers.get('main');

module.exports = () => {
  log.info(`Method "${colors.green('info')}" is global`);
  console.pikmin.error('Oh no!');
};