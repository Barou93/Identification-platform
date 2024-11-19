'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class UserNumber extends Model {
    static associate(models) {
      // define association here
      UserNumber.belongsTo(models.Number, { foreignKey: 'numberId' });
    }
  }
  UserNumber.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      numberId: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
      },
      number: DataTypes.STRING,
      otp: DataTypes.STRING,
      otpExpiresAt: DataTypes.DATE,
      otpVerified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'UserNumber',
    }
  );
  return UserNumber;
};
