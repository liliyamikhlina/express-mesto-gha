const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const Forbidden = require('../errors/Forbidden');

const errorMiddleware = (err, req, res, next) => {
  let statusCode;
  let errorMessage;

  if (err instanceof BadRequest) {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err instanceof Unauthorized) {
    statusCode = 401;
    errorMessage = err.message;
  } else if (err instanceof NotFound) {
    statusCode = 404;
    errorMessage = err.message;
  } else if (err instanceof Conflict) {
    statusCode = 409;
    errorMessage = err.message;
  } else if (err instanceof Forbidden) {
    statusCode = 403;
    errorMessage = err.message;
  } else {
    statusCode = 500;
    errorMessage = 'На сервере произошла ошибка';
  }
  res.status(statusCode).send({ message: errorMessage });
  next();
};

module.exports = errorMiddleware;
