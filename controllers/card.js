const Card = require('../models/card');

const {
  CREATED_CODE,
  ERROR_CODE,
  ERROR_INTERNAL_SERVER,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res
        .status(CREATED_CODE)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const cardId = req.params._id;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректный Id' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const cardId = req.params._id;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректный Id' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const cardId = req.params._id;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректный Id' });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
