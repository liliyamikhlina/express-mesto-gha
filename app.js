const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер!');
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

// TODO: убрать
// app.use((req, res, next) => {
//   req.user = {
//     _id: '65808ad9a97517538d172556',
//   };
//   next();
// });

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Данные по запросу не найдены' });
});

app.listen(PORT);
