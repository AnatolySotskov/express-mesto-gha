const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const UnauthorizedError = require('../errors/unauthorizedError');

const {
  CREATED_BY_CODE,
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
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
        res.status(CREATED_BY_CODE).send({ data: userData });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы неправильные данные при регистрации' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((userData) => res.send({ data: userData }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' }));
};

module.exports.getUserById = (req, res) => {
  user
    .findById(req.params._id)
    .then((userData) => {
      if (!userData) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден 404' });
        return;
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Неправильный Id (Ошибка 400)' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
    });
};

module.exports.updateProfile = (req, res) => {
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
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден 404' });
        return;
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
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
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден  404' });
        return;
      }
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы неправильные данные' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return user
    .findUserByCredentials(email, password)
    .then((userData) => {
      if (userData) {
        console.log(userData);
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
        throw new UnauthorizedError('Пользователь не найден!');
      }
      res.send({ data: userData });
    })
    .catch(next);
};
