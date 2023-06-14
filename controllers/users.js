const user = require('../models/user');
const {
  CREATED_BY_CODE,
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((userData) => {
      res.status(CREATED_BY_CODE).send({ data: userData });
    })
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
