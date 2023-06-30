const card = require('../models/card');
const NotFoundError = require('../errors/notFounrError');
const { CREATED_BY_CODE } = require('../utils/constants');
const Forbidden = require('../errors/forbidden');

const getCards = (req, res, next) => {
  card
    .find({})
    .then((dataCard) => res.send({ data: dataCard }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((dataCard) => {
      res.status(CREATED_BY_CODE).send({ data: dataCard });
    })
    .catch((err) => {
      next(err);
      // if (err.name === 'ValidationError') {
      //   res
      //     .status(ERROR_CODE)
      //     .send({
      //       message: 'Переданы неправильные данные карточки (Ошибка 400)',
      //     });
      // } else {
      //   res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
      // }
    });
};

const deleteCard = (req, res, next) => {
  const cardId = req.params._id;
  const userId = req.user._id;
  card
    .findById(cardId)
    .then((dataCard) => {
      if (!dataCard) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      }
      card
        .findByIdAndRemove(cardId)
        .then(() => res.status(CREATED_BY_CODE).send({ data: card }));
    })
    .catch((err) => {
      next(err);
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

const dislikeCard = (req, res, next) => {
  const reqCardId = req.params._id;
  const userId = req.user._id;
  card
    .findByIdAndUpdate(reqCardId, { $pull: { likes: userId } }, { new: true })
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
      //   res.status(ERROR_CODE).send({ message: 'Неправильный Id (Ошибка 400) ' });
      //   return;
      // }
      // res.status(ERROR_SERVER).send({ message: 'Произошла ошибка 500' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
