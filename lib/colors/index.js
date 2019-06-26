const s = require('./styles.js');
const toHex = (number) => {
  number = parseInt(number, 10);
  if (isNaN(number)) return '00';
  number = Math.max(0, Math.min(number, 255));

  return `${'0123456789ABCDEF'.charAt((number - number % 16) / 16)}${'0123456789ABCDEF'.charAt((number % 16))}`;
};

const convert = (content = 'FFFFFF', to) => {
  if (to === 'hex' || (content instanceof Array && content.length > 2)) return `${toHex(content[0])}${toHex(content[1])}${toHex(content[2])}`;
  else if (to === 'rgb' || content.startsWith('#') || (content instanceof String && content.length === 3 || content.length === 6)) {
    let rgb = [];

    if (content.length < 1) content = '000000';
    if (content.charAt(0) === '#') content = content.substring(1, content.length);
    if (content.length !== 6 && content.length != 3) return undefined;

    if (content.length === 3) {
      rgb.push(content.substring(0, 1));
      rgb.push(content.substring(1, 2));
      rgb.push(content.substring(2, 3));
      rgb[0] = rgb[0] + rgb[0];
      rgb[1] = rgb[1] + rgb[1];
      rgb[2] = rgb[2] + rgb[2];
    } else {
      rgb.push(content.substring(0, 2));
      rgb.push(content.substring(2, 4));
      rgb.push(content.substring(4, 6));
    }

    rgb[0] = parseInt(rgb[2], 16);
    rgb[1] = parseInt(rgb[2], 16);
    rgb[2] = parseInt(rgb[2], 16);

    return rgb;
  } else return undefined;
};

for (const key in s.colors) exports[key] = (val) => { return this.supported ? `\x1b[${s.colors[key]}m${val}\x1b[0m` : val; };
for (const key in s.styles) exports[key] = (val) => { return this.supported ? `\x1b[${s.styles[key]}m${val}\x1b[0m` : val; };

exports.hex = (hex = 'FFFFFF') => convert(hex, 'hex');
exports.rgb = (rgb = [255, 255, 255]) => convert(rgb, 'hex');
exports.strip = (value) => { return (`${value}`).replace(/\x1B\[\d+m/g, '') };
exports.convert = (content = 'FFFFFF', to) => convert(content, to);
exports.supported = (process.env.FORCE_COLOR || process.platform === 'win32' || (process.stdout.isTTY && process.env.TERM && process.env.TERM !== 'dumb'));
