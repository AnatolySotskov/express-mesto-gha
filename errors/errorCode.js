// Ошибка 400
class errorCode extends Error {
  constructor(message) {
    super(message);
    this.name = 'errorCode';
    this.statusCode = 400;
  }
}

module.exports = errorCode;
