// модуль для хеширования пароля.
const bcrypt = require('bcrypt');
// подключаем mongooseб потому что нам нужен его метод Schema для создания схемы
const mongoose = require('mongoose');
// подключаем удобный валидатор
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  // !Позже разобрать, как работает этот валидатор
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(valid) {
        return validator.isURL(valid);
      },
    },
  },
  /* пароль должен быть уникальным. Поэтому импользем unique.
  Адрес почты должен валидироваться */
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(valid) {
        return validator.isEmail(valid);
      },
    },
  },
  /* !Пароль должен быть не меньше 8 символов. Но сейчас при сохранении в базу пароль хешируется,
  а потому можно задавать пароль менее 8 символов. Этот баг надо исправить. */
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

/* Чтобы добавить собственный метод, нужно записать его в свойство statics нужной схемы,
что мы и сделали. Этот метод нужен для поиска пользователей по адресу почты. Если пользователь
не найден, то мы вручную возвращаем ошибку и промис перескакивает на блок catch.
Если пользователь с такой почтой найден, то сравниваем пришедший парроль с тем паролем,
который записан у найденного пользовталея. Для этого используется метод compare */
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль!'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль!!'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
