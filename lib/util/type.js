const symbol = require('./isSymbol');
const types  = {
  'string'   : 0,
  'symbol'   : 1,
  'object'   : 2,
  'boolean'  : 3,
  'function' : 4,
  'array'    : 5,
  'float'    : 6,
  'integer'  : 7,
  'NULL'     : 8,
  'undefined': 9
};

module.exports = (val) => {
  if (Array.isArray(val)) return types['array'];
  if (symbol(val)) return types['symbol'];
  if (Number(val) === val && val % 1 !== 0) return types['float'];
  if (Number(val) === val && val % 1 === 0) return types['integer'];
  if (types.hasOwnProperty(typeof val)) return types[typeof val];
  if (val === null) return types['NULL'];
  
  return types['undefined'];
};