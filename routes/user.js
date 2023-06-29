const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get(
  '/:_id',
  celebrate({
    params: Joi.object().keys({ _id: Joi.string().hex().length(24).required() }),
  }),
  getUserById,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object()
      .required()
      .keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
      }),
  }),
  updateProfile,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object()
      .required()
      .keys({
        avatar: Joi.string()
          .regex(/https*:\/\/[\w\S]{1,}\.[\w\S]{1,}/).required(),
      }),
  }),
  updateAvatar,
);

module.exports = userRouter;
