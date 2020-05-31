// подключаем схуму карточек
const Cards = require('../models/card');

/* обработчик, который выдает все карточки. Подробнее читать у user */
module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

/* Обработчик, который создает карточки. Получает имя и пользователя
Надо переделать, так как параметр owner должен быть автоматическим */
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

/* обработчик для удаления карточек. Если карточки по переданному ID нет, то mongoos по
умолчанию отправлет {null}. Чтобы обыграть эот, используем условную конструкцию.
orFail почему-то не работает на методе findByIdAndRemove.
!Почему с использованием asinc await - надо проверить. Попробовать убрать. */
module.exports.deleteCard = async (req, res) => {
  await Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};