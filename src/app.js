const express = require('express');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./handlers/errors')
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index'); 
const webhooksRouter = require('./routes/webhooks');
const app = express();

// 'combined' es el formato de logging más completo, adecuado para producción.
// Incluye información detallada como: método HTTP, URL, código de estado, tamaño de la respuesta,
// dirección IP del cliente, agente de usuario (navegador) y la URL de referencia.
// Ejemplo de salida:
// ::1 - - [09/Sep/2024:10:00:00 +0000] "GET /api/conekta HTTP/1.1" 200 150 "https://example.com" "Mozilla/5.0"

// 'dev' es un formato de logging más ligero y adecuado para desarrollo.
// Muestra la solicitud HTTP, el código de estado y el tiempo de respuesta en milisegundos.
// Es más conciso y fácil de leer mientras se trabaja en desarrollo.
// Ejemplo de salida:
// GET /api/conekta 200 12.345 ms

const logFormat = process.env.LOG_FORMAT;
app.use(logger(logFormat));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use('/', indexRouter);
app.use('/', webhooksRouter);

app.use(errorHandler); 

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
