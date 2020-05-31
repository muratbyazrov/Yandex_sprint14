// Подключили библиотеку экспресс
const express = require('express');

// mongoos - это некий сопоставитель, который помогает подружить JS с документами в MongoDB
const mongoose = require('mongoose');

// Этот модуль объединяет приходящие пакеты из запросв. Они доступны так: const { body } = req;
const bodyParser = require('body-parser');

// Подключили роуты
const usersRouter = require('./routes/usersRout');
const cardsRouter = require('./routes/cardsRout');
// const path = require('path');

// Так мы создали приложение на экспресс
const app = express();

/* В Node есть переменные окружения. Достать их можно из объекта process.env.
В частности, есть переменная PORT. Все переменные окружения пишут с заглавных букв */
const { PORT = 3000 } = process.env;

/* Все методы для работы с пакетами находятся в объекте bodyParser.
В данном случае испльзовали метод для собирания JSON-формата */
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// подключили монго. Тут меняется только название БД - mestodb
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  // eslint-disable-next-line no-console
  .then(() => { console.log('БД подключена!'); })
  // eslint-disable-next-line no-console
  .catch(() => { console.log('БД не подключена!'); });

// Наше приложение буде слушать запросы, которые приходят на PORT
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
