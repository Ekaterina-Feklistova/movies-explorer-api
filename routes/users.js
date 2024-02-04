const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const urlRegex = require('../utils/constants');

const { editUserData, getUserMe } = require('../controllers/users');

router.get('/me', getUserMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), editUserData);

// router.patch('/me/avatar', celebrate({
// body: Joi.object().keys({
// avatar: Joi.string().pattern(urlRegex),
// }),
// }), editUserAvatar);

module.exports = router;
