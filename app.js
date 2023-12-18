const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '65808ad9a97517538d172556',
  };

  next();
});

app.use('/cards', require('./routes/cards'));

app.listen(PORT);
