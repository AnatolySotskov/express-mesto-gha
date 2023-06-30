const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError ');
const NotFoundError = require('../errors/notFounrError');
const ErrorCode = require('../errors/errorCode');
const Conflict = require('../errors/conflict');

const { CREATED_BY_CODE } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => user
      .create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
      .then((userData) => {
        const id = userData._id;
        res.status(CREATED_BY_CODE).send({
          id, email, name, about, avatar,
        });
      }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ErrorCode('Переданы неправильные данные'));
      }
      if (error.code === 11000) {
        return next(new Conflict('Такой пользователь уже существует'));
      }
      return next(error);
    });
};

module.exports.getUsers = (req, res, next) => {
  user
    .find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user
    .findById(req.params._id)
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorCode('Некорректный id'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const reqUserId = req.user._id;

  user
    .findByIdAndUpdate(
      reqUserId,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Conflict('Отправлены неправильные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const reqUserId = req.user._id;

  user
    .findByIdAndUpdate(
      reqUserId,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((userData) => {
      if (!userData) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Conflict('Отправлены неправильные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return user
    .findUserByCredentials(email, password)
    .then((userData) => {
      if (userData) {
        const token = jwt.sign({ _id: userData._id }, 'very-secret-key', {
          expiresIn: '7d',
        });
        res.send({ token });
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  user
    .findById(userId)
    .then((userData) => {
      if (!userData) {
        throw new UnauthorizedError('Пользователь не найден');
      }
      res.send({ data: userData });
    })
    .catch(next);
};
