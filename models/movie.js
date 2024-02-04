const mongoose = require('mongoose');
const urlRegex = require('../utils/constants');

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "Страна создания фильма" должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "Режиссёр фильма" должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "Длительность фильма" должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "Год выпуска фильма" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "Описание фильма" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "Постер к фильму" должно быть заполнено'],
    validate: {
      validator(url) {
        return urlRegex.test(url);
      },
      message: 'Неправильный URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "Трейлер к фильму" должно быть заполнено'],
    validate: {
      validator(url) {
        return urlRegex.test(url);
      },
      message: 'Неправильный URL',
    },
  },
  movieId: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "Миниатюрное изображение к фильму" должно быть заполнено'],
    validate: {
      validator(url) {
        return urlRegex.test(url);
      },
      message: 'Неправильный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  nameRU: {
    type: String,
    required: [true, 'Поле "Название фильма RU" должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле "Название фильма EN" должно быть заполнено'],
  },
  // likes: {
  // type: [
  // {
  // type: mongoose.Schema.Types.ObjectId,
  // ref: 'user',
  // },
  // ],
  // default: [],
  // },
  // createdAt: {
  // type: Date,
  // default: Date.now,
  // },
}, { versionKey: false });

module.exports = mongoose.model('movie', moviesSchema);
