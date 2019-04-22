module.exports = class ConsoleTransport {
  constructor(options = {}) {
    if (!options.process) throw new TypeError(`"options.process" must be type of object but received type ${typeof options.process}`);
    if (!options.process.stdout) throw new TypeError('"options.process" does not have the property "stdout"');

    this.type = 'PROCESS';
    this.name = typeof options.name === 'string' ? options.name : undefined;
    this.format = options.format || undefined;
    this.parent = undefined;
    this.process = options.process;
    this.defaults = { inspect: true, ...options.defaults };

    return this;
  }

  append(options = this.defaults, data) {
    this.process.stdout.write(`${data}\r\n`);
  }

  destroy() { return delete this; }
};