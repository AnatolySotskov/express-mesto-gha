const userRouter = require('express').Router();

const {
  // createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:_id', getUserById);
// userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
