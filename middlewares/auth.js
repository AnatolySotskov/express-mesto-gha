const jwt = require('jsonwebtoken');
const ERROR_UN_AUTHORIZED = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ERROR_UN_AUTHORIZED('Нужно авторизоватся');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    throw new ERROR_UN_AUTHORIZED('Нужно авторизоватся');
  }

  req.user = payload;

  return next();
};
