const type = require('../util/type');
const Pikmin = require('../pikmin');
const { inspect } = require('util');
const PikminError = require('./PikminError');

module.exports = class PikminInstance {
  /**
   * Create a pikmin instance
   * 
   * @param {object} options The options for the instance
   * @param {string} [options.name='main'] The logger's name
   * @param {string} [options.format='[%h:%m:%s] %l ->'] The logger's format
   * @param {boolean} [options.autogen=false] The logger's format
   * @returns {ThisType} The pikmin instance created
   */
  constructor(options = { autogen: false }) {
    this.__log__ = {};
    this.name = this._stringify(options.name || 'main');
    this.baseFormat = options.format !== null ? this._stringify(options.format || '[%h:%m:%s] %l -> ') : '';
    this.transports = [];

    if (type(this.name) !== 0) throw new PikminError(`"options.name" must be type of string but received type ${typeof this.name}`);
    if (Pikmin.loggers.get(this.name)) throw new PikminError(`A logger instance with the name "${this.name}" already exists`);

    if (!options) return this;

    if (type(options) !== 2) throw new TypeError(`"options" must be type of object but received type ${typeof options}`);
    if (type(options.transports) !== 5) throw new TypeError(`"options.transports" must be type of array but received type ${typeof options.transports}`);

    try {
      for (const transport of options.transports) {
        const now = this._formatDate();
        transport.parent = this.name;

        if (type(transport) !== 2) throw new TypeError(`"data.transports.entry" must be type of object but received ${typeof transport}`);
        if (transport.name && this[transport.name]) throw new PikminError(`A transporter's name inflicted with an already existing declaration`);

        try {
          if (transport.type === 'FILE' && options.autogen) transport.append({}, `<PIKMIN_AUTOGEN_LINE<${now.days}/${now.months}/${now.years} ${now.hours}:${now.minutes}:${now.seconds}>>\r\n`);

          this.transports.push(transport);
          if (transport.name) {
            this[transport.name] = (msg, options) => this._print(msg, Object.assign(transport.defaults, options), transport.name, transport.format || this.baseFormat);
            this.__log__[transport.name] = (msg, options) => this._print(msg, Object.assign(transport.defaults, options), transport.name, transport.format || this.baseFormat);
          } else transport.permanent = true; 
        } catch(ex) {
          throw new PikminError(`Failed to write to transporter:\r\n${ex}`);
        }
      }
    } catch (ex) {
      throw new PikminError(ex);
    }

    Pikmin.loggers.set(this.name, this.__log__);
  }

  addTransport(transport, options = { autogen: false }) {
    const now = this._formatDate();

    if (type(transport) !== 2) throw new TypeError(`"transports" must be type of object but received type ${typeof transport}`);
    if (transport.name && this[transport.name]) throw new PikminError(`A transporter\'s name inflicted with an already existing declaration`);
    
    try {
      if (transport.type === 'FILE' && options.autogen) transport.append(`<PIKMIN_AUTOGEN_LINE<${now.days}/${now.months}/${now.years} ${now.hours}:${now.minutes}:${now.seconds}>>\r\n`);
      
      this.transports.push(transport);
      if (transport.name) {
        this[transport.name] = (msg, opt) => this._print(msg, Object.assign(transport.defaults, opt), transport.name, transport.format || this.baseFormat,);
        this.__log__[transport.name] = (msg, opt) => this._print(msg, Object.assign(transport.defaults, opt), transport.name, transport.format || this.baseFormat);
      } else transport.permanent = true; 
    } catch(ex) {
      throw new PikminError(`Failed to write to transporter:\r\n${ex}`);
    }
    
    Pikmin.loggers.set(this.name, this.__log__);
  }

  _print(msg, options = {}, lvl, starter = this.baseFormat) {
    this.transports
      .filter((v) => v.name === lvl || v.permanent)
      .forEach((v) => {
        let m = msg;
        let c = false;

        if (type(msg) === 1) m = String(msg);
        if ((v.defaults.clean && options.clean !== false) || options.clean) {
          m = this._strip(m);
          c = true;
        }
        if ((v.defaults.inspect && options.inspect !== false) || options.inspect) {
          if ([ 2, 5 ].some((v) => type(msg) === v)) m = inspect(msg, false, null, !c);
        }

        v.append(options, `${this._format(starter, lvl, c)}${m}`);
      });
  }

  _format(msg, lvl, clean) {
    const now = this._formatDate();
    msg = msg
      .replace(/%h/g, now.hours)
      .replace(/%m/g, now.minutes)
      .replace(/%s/g, now.seconds)
      .replace(/%l/g, lvl || '');

    if (clean) return this._strip(msg);
    else return msg;
  }

  _formatDate(date = new Date()) {
    return {
      hours: date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours(),
      minutes: date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes(),
      seconds: date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds(),
      milliseconds: date.getMilliseconds(),

      days: date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate(),
      years: date.getFullYear(),
      months: date.getMonth() +1 <= 9 ? `0${date.getMonth() +1}` : date.getMonth() +1
    };
  }

  _stringify(string) {
    if ([ 0, 1, 3, 4, 6, 7, 8, 9 ].some((v) => type(string) === v)) return String(string);
    if ([ 2, 5 ].some((v) => type(string) === v)) return inspect(string);
    return String(string);
  }

  _strip(str) { return (`${str}`).replace(/\x1B\[\d+m/g, ''); }
};
