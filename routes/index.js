const router = require('express').Router();

const userRouter = require('./user');
const cardRouter = require('./card');
const { ERROR_NOT_FOUND } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = router;
