const card = require('../models/card');
const NotFoundError = require('../errors/notFounrError');
const {
  CREATED_BY_CODE,
  ERROR_CODE,
  ERROR_SERVER,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

const getCards = (req, res) => {
  card
    .find({})
    .then((dataCard) => res.send({ data: dataCard }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((dataCard) => {
      res.status(CREATED_BY_CODE).send({ data: dataCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Переданы неправильные данные карточки (Ошибка 400)' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
      }
    });
};

const deleteCard = (req, res) => {
  const reqCardId = req.params._id;
  card
    .findByIdAndRemove(reqCardId)
    .then((dataCard) => {
      if (!dataCard) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена (Ошибка 404)' });
        return;
      }
      res.send({ data: dataCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Неправильный Id (Ошибка 400)' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
    });
};

const likeCard = (req, res, next) => {
  const reqCardId = req.params._id;
  const userId = req.user._id;
  card
    .findByIdAndUpdate(
      reqCardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .then((dataCard) => {
      if (!dataCard) {
        throw new NotFoundError('Карточка не найдена (Ошибка 404)');
        // res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена (Ошибка 404)' });
        // return;
      }
      res.send({ data: dataCard });
    })
    .catch((err) => {
      next(err);
      // if (err.name === 'CastError') {
      //   res.status(ERROR_CODE).send({ message: 'Неправильный Id (Ошибка 400)' });
      //   return;
      // }
      // res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
    });
};

const dislikeCard = (req, res) => {
  const reqCardId = req.params._id;
  const userId = req.user._id;
  card
    .findByIdAndUpdate(reqCardId, { $pull: { likes: userId } }, { new: true })
    .then((dataCard) => {
      if (!dataCard) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена (Ошибка 404)' });
        return;
      }
      res.send({ data: dataCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Неправильный Id (Ошибка 400) ' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
