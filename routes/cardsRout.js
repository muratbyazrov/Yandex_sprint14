// У express есть метод Router, который позволяет навешивать обработчики
const cardsRouter = require('express').Router();

// подключили мидлвер для авторизации
const auth = require('../middlewares/auth');

// Экспортировали обработчики
const { getCards, createCard, deleteCard } = require('../controllers/cards');

// применяем нужные обработчики при соответсвующих запроссах
// auth - это мидлвер для авторизации. После неё идут роуты, кторые нужно авторизовывать
cardsRouter.get('/', auth, getCards);
cardsRouter.post('/', auth, createCard);
cardsRouter.delete('/:cardId', auth, deleteCard);

module.exports = cardsRouter;
