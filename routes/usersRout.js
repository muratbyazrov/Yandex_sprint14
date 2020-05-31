// У express есть метод Router, который позволяет навешивать обработчики
const usersRouter = require('express').Router();

// подключили мидлвер для авторизации
const auth = require('../middlewares/auth');

// Экспортировали обработчики
const {
  getUsers, getUserById, createUser, login,
} = require('../controllers/users');

// применяем нужные обработчики при соответсвующих запроссах
// auth - это мидлвер для авторизации. После неё идут роуты, кторые нужно авторизовывать
usersRouter.get('/', auth, getUsers);
usersRouter.get('/:id', auth, getUserById);
usersRouter.post('/signup', createUser);
usersRouter.post('/signin', login);

module.exports = usersRouter;
