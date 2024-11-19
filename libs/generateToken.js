/** @format */

const jwt = require('jsonwebtoken');
const models = require('../models');
const User = models.User;

const createCookie = require('./createCookie');

const createSendToken = async (user, statusCode, message, res) => {
  const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN * 1 * 60 * 60 * 1000,
    });
  };
  const accessToken = signToken(user.id);

  //Create cookies values
  createCookie(res, accessToken, 'accessToken');

  //Remove password and twoFactorSecret from output
  user.password = undefined;
  user.twoFactorSecret = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      message,
    },
  });
};
module.exports = createSendToken;
