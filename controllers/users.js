// модуль для хеширования пароля
const bcrypt = require('bcrypt');

// модуль для создания токенов
const jwt = require('jsonwebtoken');

// подключили схему пользователя
const User = require('../models/user');

/* Создаем обработчик, который передает в ответе всех пользователей.
Метод findOne возвращает первый документ, соответствующий запросу. В данном случае, так как
в запросе пусто, возвращаются все документы из БД, так они все сразу удовлетворяют запросу */
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

/* Создаем обработчик, который возвращает пользователя по ID. По умолчанию
мангус возвращает {null}, если документов с искомым ID нет. Чтобы исправить это, используется
orFail. Используется с asinc await. await звставляет интерпретатор JS ждать, пока код справа от
неё не выполнится. */
module.exports.getUserById = async (req, res) => {
  await User.findById(req.params.id)
    .orFail(new Error('Нет такого пользователя'))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: err.message }));
};

/* Обработчик, который создает пользователей по разработанной схеме User. Для этого сначала
получаем необходимые данные из тела запроса и передаем их методу create модели User */
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // метод bcrypt создает для входящего пароля хеш с солью 10.
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => res.status(400).send({ message: err.message }));
    });
};


/*
***Этот обработчик принимает пароль и логин и пытается авторизовать пользователя
***findUserByCredentials - это статический метож, который мы создали для проверки
логина и пароля. Если логин или пароль окахываются неправильными. выдаем ошибку.
Если верно, то создаем токен методом sign сроком 7 дней. Токен мы зыписываем в куки
для безопасности приложения, так как в куки у JS нет доступа.
***Если метод findUserByCredentials вернул пользователя(то есть логин и пароль правильные),
то мы создаем токен с помощью метода jwn.sign. На вход принимает пейлоуд - полезный груз токена
и ключевое слово !которое надо хранить в переменной окружения на сервере - этого здесь не сделано.
Так же мы передали срок хранения токена !но так как токен мы храним в куки, а у куки есть свой
срок хранения, то скорее всего для самого токена срок хранения не нужен.
В express cookie устанавливают методом res.cookie. Этот метод на вход принимает
ключ и значение ключа jwt:token. Так же ожно задать максимальный срок жизни.
Чтобы по умолчанию к кукам не было домтупа из JS, включают опцию httpOnly: true
*/
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 86400 * 7,
          httpOnly: true,
        });
      res.send({ message: 'авторизация прошла успешна. Токен записан в куки' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
