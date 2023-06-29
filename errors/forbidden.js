// HTTP 403 Forbidden — стандартный код ответа HTTP
class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Forbidden;
