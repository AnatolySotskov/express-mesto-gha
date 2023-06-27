const router = require('express').Router();
const auth = require('../middlewares/auth');
const singup = require('./signup');
const singin = require('./signup');

const userRouter = require('./user');
const cardRouter = require('./card');
const { ERROR_NOT_FOUND } = require('../utils/constants');

router.post('/signin', singup);
router.post('/signup', singin);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = router;
