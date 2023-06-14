const express = require('express');
const mongoose = require('mongoose');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6488cb0f1f622fa0e906182e',
  };
  next();
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт сервера ${PORT}`);
});
