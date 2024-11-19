const AppError = require('../utils/appError');

//Verify if eamil and password values matched with the regex values
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$/;
//Password doit contenir au moins une majuscule un symbole et un nombre et doit faire min 8
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = (email, errorMessage) => {
  errorMessage = 'Email est incorrect, merci de renseigner un mail valide';
  if (!emailRegex.test(email)) {
    throw new AppError(errorMessage, 400);
  }
};

const validatePassword = (password, errorMessage) => {
  errorMessage =
    'Le mot de passe doit avoir 8 caractères et inclure 1 lettre majuscule, 1 chiffre et 1 caractère spécial';
  if (!passwordRegex.test(password)) {
    throw new AppError(errorMessage, 400);
  }
};
module.exports = { validateEmail, validatePassword };
