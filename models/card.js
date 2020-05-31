// подключаем mongooseб потому что нам нужен его метод Schema для создания схемы
const mongoose = require('mongoose');
// подключаем удобный валидатор
const validator = require('validator');


const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  // !Позже разобрать, как работает этот валидатор
  link: {
    type: String,
    required: true,
    validate: {
      validator(valid) {
        return validator.isURL(valid);
      },
    },
  },
  /* мы хотим связать два документа. Лучший способ - с помощью ID. На уровне схемы
  это позволяет сделать Types.ObjectId и свойство ref. В ref записывается с\имя модели,
  на которую мы ссылаемся */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  /* тут так эе хотим связать два документа. Поэтому используем тот же Types.ObjectId.
  по умолчанию массив должен быть пустым. Поэтому default:[]. Тип массив из айдишек */
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  /* Тут просто дату добавляем */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
