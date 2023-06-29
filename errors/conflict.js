// HTTP 409 Conflict код состояния ответа указывает на конфликт запроса с текущим состоянием сервера
class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Conflict;
