/**
 * @format
 * @param
 * @param {string}
 * @param {void}
 */

const { promisify } = require('util');
const models = require('../models');
const User = models.User;
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getTokenFromRequest = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  } else if (req.cookies.admin_token || req.cookies.accessToken) {
    return req.cookies.access_token || req.cookies.accessToken;
  }
  return null;
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return next(
      new AppError(
        `Vous n'êtes pas connecté ! Veuillez vous connecter pour accéder à cette page`,
        401
      )
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if user still exists
  let currentUser;

  currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("L'utilisateur lié à ce token n'existe plus.", 401)
    );
  }
  console.log('req.user.id:', currentUser);
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Vous avez récemment changé de mot de passe ! Veuillez vous connecter à nouveau.',
        401
      )
    );
  }
  //5 Grant Access to protected route
  req.user = currentUser;
  next();
});

exports.restricTo = (...role) => {
  return (req, res, next) => {
    //roles [reviewer, admin] roles = "reviewer"
    if (!role.includes(req.user.roles)) {
      return next(
        new AppError(
          "Vous n'avez pas l'autorisation d'effectuer cette action",
          403
        )
      );
    }
    next();
  };
};
