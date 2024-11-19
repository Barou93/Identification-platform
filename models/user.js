/** @format */

'use strict';
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          // isTelecelMali(value) {
          //   if (!value.endsWith('@telecelmali.com')) {
          //     throw new Error(
          //       "Only emails ending with '@telecelmali.com are allowed'"
          //     );
          //   }
          // },
        },
      },
      password: DataTypes.STRING,
      roles: DataTypes.ENUM('rewier', 'admin'),
      passwordChangedAt: DataTypes.DATE,
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,

      isAdmin: DataTypes.BOOLEAN,
    },

    {
      sequelize,
      modelName: 'User',
    }
  );
  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };
  //Create a password reset token to send a random value in the email

  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetToken = Date.now() + 5 * 60 * 1000; //expires after 5 mins
    return resetToken;
  };
  return User;
};
