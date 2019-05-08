const type = require('../util/type');
const Pikmin = require('../pikmin');
const PikminError = require('./PikminError');

exports.bind = (logger, log = console, specific = false) => {
  if (log && !specific) log.pikmin = {};
  
  if (type(logger) === 2) {
    if (!logger.name && !logger.transports && !logger.__log__) throw new PikminError('The logger you\'ve provided isn\'t valid');

    Pikmin.loggers.get(logger.name).__bound__ = log;
    if (log && !specific) log.pikmin = Object.assign(log.pikmin, logger.__log__);
    else if (specific) log = Object.assign(log, logger.__log__);
  } else {
    if (!Pikmin.loggers.has(logger)) throw new PikminError('The logger you\'ve provided isn\'t valid');
    
    Pikmin.loggers.get(logger.name).__bound__ = log;
    if (log && !specific) log.pikmin = Object.assign(log.pikmin, Pikmin.loggers.get(logger));
    else if (specific) log = Object.assign(log, Pikmin.loggers.get(logger));
  }

  return true;
};

exports.unbind = (logger, global = true) => {
  if (type(logger) === 2) {
    if (!logger.name && !logger.transports && !logger.__log__) throw new PikminError('The logger you\'ve provided isn\'t valid');

    const log = Pikmin.loggers.get(logger.name);
    if (global && log.__bound__) {
      for (const key of Object.keys(log)) delete log.__bound__[key];
    }

    return Pikmin.loggers.delete(logger.name);
  } else {
    if (!Pikmin.loggers.has(logger)) throw new PikminError('The logger you\'ve provided isn\'t valid');

    const log = Pikmin.loggers.get(logger);
    if (global && log.__bound__) {
      for (const key of Object.keys(log)) delete log.__bound__[key];
    }
    
    return Pikmin.loggers.delete(logger.name);
  }
};