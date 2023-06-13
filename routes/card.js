const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:_id', deleteCard);
cardRouter.put('/:_id/likes', likeCard);
cardRouter.delete('/:_id/likes', dislikeCard);

module.exports = cardRouter;
