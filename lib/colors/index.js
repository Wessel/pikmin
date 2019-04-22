const s = require('./styles.js');

for (const key in s.colors) exports[key] = (val) => { return this.supported ? `\x1b[${s.colors[key]}m${val}\x1b[0m` : val; };
for (const key in s.styles) exports[key] = (val) => { return this.supported ? `\x1b[${s.styles[key]}m${val}\x1b[0m` : val; };

exports.strip = (val) => { return (`${val}`).replace(/\x1B\[\d+m/g, ''); };
exports.supported = (process.env.FORCE_COLOR || process.platform === 'win32' || (process.stdout.isTTY && process.env.TERM && process.env.TERM !== 'dumb'));