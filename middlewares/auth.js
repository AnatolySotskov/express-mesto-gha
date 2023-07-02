const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError ');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Нужно авторизоватся'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Нужно авторизоватся'));
  }

  req.user = payload;

  return next();
};
