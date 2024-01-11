const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors, isCelebrateError } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Данные по запросу не найдены' });
});

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    err.details.forEach((error) => {
      console.log(error.message);
      res.status(400).send({ message: error.message });
    });
  }
  return next(err);
});

app.use(errorMiddleware);

app.listen(PORT);
