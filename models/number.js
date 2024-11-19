/** @format */

'use strict';

const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Number extends Model {
    static associate(models) {
      // define association here
      Number.hasMany(models.IdentificationRequest, { foreignKey: 'numberId' });
      Number.hasMany(models.UserNumber, { foreignKey: 'numberId' });
    }
  }
  Number.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Number',
    }
  );
  return Number;
};
