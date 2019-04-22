module.exports = class PikminError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PikminError';
  }
};