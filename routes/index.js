const router = require('express').Router();

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./user');
const cardRouter = require('./card');
const { ERROR_NOT_FOUND } = require('../utils/constants');

router.post('/signup', login);
router.post('/signin', createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = router;
