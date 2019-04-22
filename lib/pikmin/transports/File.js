const { createWriteStream, readFileSync, mkdirSync } = require('fs');

module.exports = class FileTransport {
  constructor(options = { flags: 'a' }) {
    let file;

    try {
      if (/\/\//.test(options.file)) {
        let prev = './';
        for (const path of options.file.split('//').slice(0, -1)) {
          try { mkdirSync(`${prev}/${path}`); }
          catch (ex) {}
          prev = `${prev}/${path}`;
        }
      }
      if (/\//.test(options.file)) {
        let prev = './';
        for (const path of options.file.split('/').slice(0, -1)) {
          try { mkdirSync(`${prev}/${path}`); }
          catch (ex) {}
          prev = `${prev}/${path}`;
        }
      }

      try { file = readFileSync(options.file, { encoding: 'utf8' }); }
      catch (ex) { file = undefined; }
      
      this.type = 'FILE';
      this.stream = createWriteStream(options.file, { flags: options.flags });
    } catch (ex) {
      throw new Error(`Unable to access / write to "${options.file}":\r\n${ex}`);
    }

    this.name = typeof options.name === 'string' ? options.name : undefined;
    this.parent = undefined;
    this.format = options.format || undefined;
    this.defaults = { inspect: true, clean: true, ...options.defaults };

    this.stream.write(file || '');

    return this;
  }

  append(options = this.defaults, ...data) {
    this.stream.write(`${data}\r\n`);
  }

  destroy() {
    let trace = { success: false };

    try {
      this.stream.end();
      trace.success = true;
    } catch (ex) {
      trace.error = ex;
      trace.success = false;
    }

    return trace, delete this;
  }
};