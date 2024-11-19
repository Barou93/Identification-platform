const AppError = require('../utils/appError');

const handleAccesDeniedError = (err) => {
  const message = `${err.sqlMessage}`;
  return new AppError(message, 400);
};
const handleDuplicateFielsDB = (err) => {
  const message = `Valeur du champ en double : ${err.parent.sqlMessage}. Veuillez utiliser une autre valeur`;
  return new AppError(message, 400);
};

const handleDBError = (err) => {
  const message = `${err.parent.sqlMessage}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = `Erreur de validation. Veuillez vérifier votre saisie`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  new AppError(`Token invalide, Veuillez vous connectez`, 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleJWTExpiredError = (err) => {
  new AppError(`Votre session a expiré! Veuillez vous reconnecter...`, 401);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error 🔥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'SequelizeDatabaseError') error = handleDBError(error);
    if (error.code === 1062) error = handleDuplicateFielsDB(error);
    if (error.name === 'SequelizeValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'SequelizeAccessDeniedError')
      error = handleAccesDeniedError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
