const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connect } = require('./config/database');
const indexRouter = require('./routes/index'); 
const app = express();

// 'combined' es el formato de logging más completo, adecuado para producción.
// Incluye información detallada como: método HTTP, URL, código de estado, tamaño de la respuesta,
// dirección IP del cliente, agente de usuario (navegador) y la URL de referencia.
// Ejemplo de salida:
// ::1 - - [09/Sep/2024:10:00:00 +0000] "GET /api/conekta HTTP/1.1" 200 150 "https://example.com" "Mozilla/5.0"

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


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
