const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotfoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    movieId,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка с указанным id не найдена.'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточка другого пользователя');
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' }))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError('Карточка с id не найдена'));
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError('Некорректный id карточки'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

// module.exports.likeCard = (req, res, next) => {
// Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
// .orFail()
// .populate(['owner', 'likes'])
// .then((card) => res.status(HTTP_STATUS_OK).send(card))
// .catch((err) => {
// if (err instanceof mongoose.Error.DocumentNotFoundError) {
// next(new NotFoundError('Карточка с id не найдена'));
// } else if (err instanceof mongoose.Error.CastError) {
// next(new BadRequestError('Некорректный id карточки'));
// } else {
// next(err);
// }
// });
// };

// module.exports.dislikeCard = (req, res, next) => {
// Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
// .orFail()
// .populate(['owner', 'likes'])
// .then((card) => res.status(HTTP_STATUS_OK).send(card))
// .catch((err) => {
// if (err instanceof mongoose.Error.DocumentNotFoundError) {
// next(new NotFoundError('Карточка с id не найдена'));
// } else if (err instanceof mongoose.Error.CastError) {
// next(new BadRequestError('Некорректный id карточки'));
// } else {
// next(err);
// }
// });
// };
