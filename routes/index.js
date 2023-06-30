const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./user');
const cardRouter = require('./card');
const { ERROR_NOT_FOUND } = require('../utils/constants');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/https*:\/\/[\w\S]{1,}\.[\w\S]{1,}/),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена 404' });
});

module.exports = router;
