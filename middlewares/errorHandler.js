const { ERROR_SERVER } = require('../utils/constants');

const errorHandler = ((err, _, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === ERROR_SERVER ? 'Ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });
  next();
});

module.exports = errorHandler;
