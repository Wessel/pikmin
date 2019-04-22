const pkg = require('../../../package.json');
const PikminError = require('../PikminError');

let wump;
try { wump = require('wumpfetch'); }
catch (ex) { wump = undefined; }


module.exports = class WebhookTransport {
  constructor(options = {}) {
    if (typeof options.url !== 'string') throw new TypeError(`"options.url" must be type of string but received type ${typeof options.url}`);

    if (!wump) {
      try { wump = require('wumpfetch'); }
      catch (ex) { throw new PikminError('The package "wumpfetch" is required in order to create a webhook transport'); }
    };

    this.url = options.url;
    this.type = 'WEBHOOK';
    this.name = typeof options.name === 'string' ? options.name : undefined;
    this.body = options.body ? options.body : { content: '%m' };
    this.clean = options.clean ? options.clean : true;
    this.queue = 0;
    this.parent = undefined;
    this.timeout = typeof options.timeout === 'number' ? options.timeout : 500;
    this.headers = typeof options.headers === 'object' ? options.headers : {};
    this.defaults = { inspect: true, clean: true, ...options.defaults };

    return this;
  }

  append(options = this.defaults, data) {
    let req = {};

    for (const v in this.body) req[v] = this.body[v].replace(/%m/g, data);
    if (!this.headers.hasOwnProperty('User-Agent')) this.headers['User-Agent'] = `Pikmin/${pkg.version} (https://github.com/PassTheWessel/pikmin)`;

    setTimeout(async() => {
      this.queue--;
      return await wump(this.url, { method: 'post', data: req, chaining: false });
    }, this.timeout * ++this.queue);
  }

  destroy() { return delete this; }
};