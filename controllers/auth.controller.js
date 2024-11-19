/**
 * @format
 * @param
 * @param {string}
 * @param {void}
 * @param {number}
 */

const { validateEmail, validatePassword } = require('../libs/regex');
const models = require('../models');
const User = models.User;
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const createCookie = require('../libs/createCookie');
const jwt = require('jsonwebtoken');
const createSendToken = require('../libs/generateToken');
const AppError = require('../utils/appError');

const clearCookie = (res, name) => {
  return res.clearCookie(name);
};
exports.signUp = catchAsync(async (req, res, next) => {
  console.log('body:', req.body);
  const { email, password, isAdmin, passwordChangedAt } = req.body;
  if (email === '' && password === '') {
    return next(
      new AppError('Veuillez saisir votre email et votre mot de passe', 400)
    );
  }
  validateEmail(email);
  validatePassword(password);

  const emailFound = await User.findOne({ where: { email } });
  if (emailFound) {
    throw new AppError(
      'Cet email est déjà pris! Saisissez une autre adresse e-mail',
      401
    );
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const roles = isAdmin ? 'admin' : 'reviewer';
  const user = await User.create({
    email,
    password: hashedPassword,
    roles,
    isAdmin: !!isAdmin,
    passwordChangedAt: new Date(),
  });

  return await createSendToken(
    user,
    201,
    `Le compte de ${user.email} a été créer avec success`,
    res
  );
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //verify entries
  if (!email || !password) {
    return next(new AppError('Email et mot de passe sont requis', 400));
  }
  //Check if user existing in db
  const user = await User.findOne({ where: { email }, raw: true });
  if (!user) return next(new AppError('Utilisateur non trouvé', 404));

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return next(new AppError('Mot de passe incorrect', 401));
  }
  clearCookie(res, 'accessToken');

  // Envoyer les tokens
  await createSendToken(user, 200, `Bienvenue ${user.email}`, res);
});

exports.logout = (req, res) => {
  clearCookie(res);
  res.status(200).json({ status: 'success', message: 'Déconnexion réussie.' });
};
