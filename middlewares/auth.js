// модуль для создания токенов
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // убеждаемся, что он заголовок есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // если токен есть, надо его извлечь без Bearer с помощью replace
  const token = authorization.replace('Bearer ', '');
  /*
  убедимся, что токен именно тот, который ранее пользователь присылал.
  Метод принимает на вход два параметра: токен и секретный ключ, которым этот токен был подписан.
  Метод `jwt.verify` вернёт пейлоуд токена, если тот прошёл проверку.
  Если же с токеном что-то не так, нам вернётся ошибка
  Чтобы её обработать, нужно обернуть метод `jwt.verify` в `try...catch`:
  */
  let payload;
  try {
    const { JWT_SECRET } = process.env;
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
