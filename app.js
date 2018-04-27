const express = require('express');
const app = express();

const UploadController = require('./controllers/UploadController');
const ZipToCbsaController = require('./controllers/ZipToCbsaController');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cbsa')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.locals.db = mongoose.connection;

app.use('/admin', UploadController);
app.use('/ziptocbsa', ZipToCbsaController);

module.exports = app;