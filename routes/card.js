const cardRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCards);

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .regex(/https*:\/\/[\w\S]{1,}\.[\w\S]{1,}/)
        .required(),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({ _id: Joi.string().hex().length(24).required()}),
  }),
  deleteCard,
);

cardRouter.put(
  '/:_id/likes',
  celebrate({
    params: Joi.object().keys({ _id: Joi.string().hex().length(24).required() }),
  }),
  likeCard,
);

cardRouter.delete(
  '/:_id/likes',
  celebrate({
    params: Joi.object().keys({ _id: Joi.string().hex().length(24).required() }),
  }),
  dislikeCard,
);

module.exports = cardRouter;
