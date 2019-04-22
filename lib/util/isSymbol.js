const getTag = (val) => {
  if (val === null) return val === undefined ? '[object Undefined]' : '[object Null]';
  return toString.call(val);
};

module.exports = (val) => {
  const type = typeof val;
  return type === 'symbol' || (type === 'object' && val !== null && getTag(val) === '[object Symbol]');
};