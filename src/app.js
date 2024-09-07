const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connect } = require('../config/database');
const indexRouter = require('./routes/index'); 

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter); 

const port = process.env.PORT || 3000;

connect()
  .then((connected) => {
    if (connected) {
      console.log('Conectado a PostgreSQL con Sequelize');
    } else {
      console.warn('No se pudo conectar a la base de datos.');
    }

    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con PostgreSQL:', error);
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  });

module.exports = app;
