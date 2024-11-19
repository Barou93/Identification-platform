/**
 * @
 *
 * @format
 * @param {String}
 */

//Gerer les differents erreurs serveur de l'application
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    (this.statusCode = statusCode),
      (this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error"); //Verifier si le status de l'erreur commence par le chiffre 4
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
